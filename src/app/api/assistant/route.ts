import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// AkashVani AI Assistant — server route handler
// ---------------------------------------------------------------------------
// This is the ONLY place the Gemini API key is read. It is a private
// (non NEXT_PUBLIC_) environment variable, so it is never bundled into
// client JavaScript. The browser only ever talks to this route.
// ---------------------------------------------------------------------------

// Use the model currently supported for new Gemini API users. The model can
// still be changed per deployment with GEMINI_MODEL.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
const GEMINI_TIMEOUT_MS = 45_000;

interface ChatTurn {
  role: 'user' | 'assistant';
  text: string;
}

interface AssistantContext {
  locationName?: string;
  weather?: Record<string, unknown>;
  forecastHourly?: unknown[];
  risk?: Record<string, unknown>;
  aqi?: Record<string, unknown>;
  alerts?: unknown[];
  persona?: string;
  language?: string;
  mapSelection?: Record<string, unknown>;
}

interface AssistantRequestBody {
  message: string;
  history?: ChatTurn[];
  context?: AssistantContext;
  mode?: 'chat' | 'explain_alert' | 'summarize_weather';
}

function buildSystemInstruction(context: AssistantContext = {}, mode: string) {
  const languageName = context.language || 'English';

  const contextLines: string[] = [];
  if (context.locationName) contextLines.push(`Location: ${context.locationName}`);
  if (context.persona) contextLines.push(`User persona: ${context.persona}`);
  if (context.weather) contextLines.push(`Current weather data: ${JSON.stringify(context.weather)}`);
  if (context.forecastHourly) contextLines.push(`Hourly forecast data: ${JSON.stringify(context.forecastHourly)}`);
  if (context.risk) contextLines.push(`Risk assessment data: ${JSON.stringify(context.risk)}`);
  if (context.aqi) contextLines.push(`Air quality data: ${JSON.stringify(context.aqi)}`);
  if (context.alerts) contextLines.push(`Active official alerts: ${JSON.stringify(context.alerts)}`);
  if (context.mapSelection) contextLines.push(`Selected map point: ${JSON.stringify(context.mapSelection)}`);

  const base = `You are the AkashVani AI Assistant, a concise weather assistant for people in India.

Rules you must always follow:
- Answer only questions about weather conditions or forecasts for states and Union Territories in India. Do not answer general knowledge, non-weather, non-Indian-location, disaster, AQI, health, or alert questions.
- If a request is outside that scope, reply only: "I can provide brief weather information for states and Union Territories in India."
- Only use the DATA CONTEXT block below as your factual basis. Never invent weather measurements, forecasts, locations, or dates.
- If the context does not contain weather data for the requested state or Union Territory, reply only: "I don't have weather data for [place] right now."
- Keep every answer to one or two brief sentences (45 words maximum).
- Reply in ${languageName}.
- Never claim something is "live" or "official" unless the context explicitly says so.

DATA CONTEXT:
${contextLines.length ? contextLines.join('\n') : 'No live data context was provided for this request.'}`;

  if (mode === 'explain_alert') {
    return `${base}\n\nTASK: The requested task is outside scope. Use the exact out-of-scope reply from the rules above.`;
  }
  if (mode === 'summarize_weather') {
    return `${base}\n\nTASK: Write a one- or two-sentence weather-only summary for the location in the data context.`;
  }
  return base;
}

function upstreamErrorMessage(status: number, detail: string) {
  const normalizedDetail = detail.toLowerCase();

  if (
    status === 400 &&
    (normalizedDetail.includes('api_key_invalid') || normalizedDetail.includes('api key not valid'))
  ) {
    return 'AI assistant is not configured correctly: GEMINI_API_KEY is invalid. Add a valid Gemini API key on the server and restart the app.';
  }
  if (status === 401 || status === 403) {
    return 'AI assistant is not authorized to use Gemini. Check the server GEMINI_API_KEY and its API permissions.';
  }
  if (status === 429) {
    return 'AI assistant is temporarily busy or has reached its Gemini quota. Please try again shortly.';
  }
  if (status === 400) {
    return 'AI assistant request was rejected by Gemini. Check the server model and Gemini API configuration.';
  }

  return `AI assistant is temporarily unavailable (upstream ${status}).`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { status: 'error', error: 'AI assistant is not configured on the server (missing GEMINI_API_KEY).' },
      { status: 503 }
    );
  }

  let body: AssistantRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ status: 'error', error: 'Invalid request body.' }, { status: 400 });
  }

  const { message, history = [], context = {}, mode = 'chat' } = body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ status: 'error', error: 'A message is required.' }, { status: 400 });
  }

  const systemInstruction = buildSystemInstruction(context, mode);

  const contents = [
    ...history
      // Brief weather answers do not need a long conversation replay. Keeping
      // the request compact also reduces provider latency.
      .slice(-4)
      .filter(
        (turn): turn is ChatTurn =>
          Boolean(turn) &&
          (turn.role === 'user' || turn.role === 'assistant') &&
          typeof turn.text === 'string' &&
          Boolean(turn.text.trim())
      )
      .map((turn) => ({
        role: turn.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: turn.text }],
      })),
    { role: 'user', parts: [{ text: message }] },
  ];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  try {
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: {
          temperature: 0.4,
          // The assistant is intentionally limited to one or two short sentences.
          maxOutputTokens: 96,
          // Gemini 3.6 defaults to medium reasoning. Minimal reasoning is a
          // better fit for factual, brief weather responses and avoids long
          // first-token delays.
          thinkingConfig: { thinkingLevel: 'minimal' },
        },
      }),
      // Keep this fast — the UI shows a "Thinking..." state, don't let it hang forever.
      signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text().catch(() => '');
      return NextResponse.json(
        {
          status: 'error',
          error: upstreamErrorMessage(geminiRes.status, errText),
        },
        { status: 502 }
      );
    }

    const data = await geminiRes.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text || '')
      .join('')
      ?.trim();

    if (!text) {
      return NextResponse.json(
        { status: 'error', error: 'AI assistant returned an empty response.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: {
        text,
        model: GEMINI_MODEL,
        generatedAt: new Date().toISOString(),
        // Transparency factors — "Why this answer?" — never chain-of-thought, just what fed the answer.
        factors: Object.keys(context).filter((k) => (context as Record<string, unknown>)[k] !== undefined),
      },
    });
  } catch (err) {
    const isTimeout =
      err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError');
    return NextResponse.json(
      {
        status: 'error',
        error: isTimeout
          ? 'AI assistant took too long to respond. Please try again.'
          : 'Unable to reach the AI assistant service.',
      },
      { status: 504 }
    );
  }
}
