import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

// ---------------------------------------------------------------------------
// AkashVani AI Assistant — server route handler
// ---------------------------------------------------------------------------
// This is the ONLY place the Gemini API key is read. It is a private
// (non NEXT_PUBLIC_) environment variable, so it is never bundled into
// client JavaScript. The browser only ever talks to this route.
// ---------------------------------------------------------------------------

// Use the model currently supported for new Gemini API users. The model can
// still be changed per deployment with GEMINI_MODEL.
// This assistant only produces short factual weather replies. Flash-Lite is
// purpose-built for low-latency, high-throughput requests of this kind.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
const GEMINI_PRIMARY_TIMEOUT_MS = 40_000;
const GEMINI_RETRY_TIMEOUT_MS = 15_000;
const GEMINI_MAX_ATTEMPTS = 2;

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
  const isHindi = languageName.startsWith('Hindi');
  const isBengali = languageName.startsWith('Bengali');
  const scopeReply = isHindi
    ? 'मैं केवल भारत के राज्यों और केंद्र शासित प्रदेशों की संक्षिप्त मौसम जानकारी दे सकता हूँ।'
    : isBengali
    ? 'আমি শুধু ভারতের রাজ্য ও কেন্দ্রশাসিত অঞ্চলের সংক্ষিপ্ত আবহাওয়ার তথ্য দিতে পারি।'
    : 'I can provide brief weather information for states and Union Territories in India.';
  const missingDataReply = isHindi
    ? 'मेरे पास अभी [स्थान] के लिए मौसम की जानकारी नहीं है।'
    : isBengali
    ? 'আমার কাছে এখন [স্থান]-এর আবহাওয়ার তথ্য নেই।'
    : "I don't have weather data for [place] right now.";
  const languageRule = languageName.startsWith('Hindi')
    ? 'Reply only in Hindi, written in Devanagari script.'
    : languageName.startsWith('Bengali')
    ? 'Reply only in Bengali, written in Bengali script.'
    : 'Reply only in English.';

  const contextLines: string[] = [];
  if (context.locationName) contextLines.push(`Location: ${context.locationName}`);
  if (context.persona) contextLines.push(`User persona: ${context.persona}`);
  if (context.weather) contextLines.push(`Current weather data: ${JSON.stringify(context.weather)}`);
  if (context.forecastHourly) contextLines.push(`Hourly forecast data: ${JSON.stringify(context.forecastHourly)}`);

  const base = `You are the AkashVani AI Assistant, a concise weather assistant for people in India.

Rules you must always follow:
- Answer only questions about weather conditions or forecasts for states and Union Territories in India. Do not answer general knowledge, non-weather, non-Indian-location, disaster, AQI, health, or alert questions.
- If a request is outside that scope, reply only: "${scopeReply}"
- Only use the DATA CONTEXT block below as your factual basis. Never invent weather measurements, forecasts, locations, or dates.
- If the context does not contain weather data for the requested state or Union Territory, reply only: "${missingDataReply}"
- Keep every answer to one or two brief sentences (30 words maximum).
- ${languageRule} The requested voice locale is ${languageName}.
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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isTransientStatus(status: number) {
  return status === 408 || status === 429 || status >= 500;
}

async function fetchGemini(url: string, payload: object) {
  let lastError: unknown;

  for (let attempt = 0; attempt < GEMINI_MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        // A cold Gemini request can take over 30 seconds. Reserve most of the
        // route budget for the primary request and leave a short retry window.
        signal: AbortSignal.timeout(
          attempt === 0 ? GEMINI_PRIMARY_TIMEOUT_MS : GEMINI_RETRY_TIMEOUT_MS
        ),
      });

      if (!isTransientStatus(response.status) || attempt === GEMINI_MAX_ATTEMPTS - 1) {
        return response;
      }

      // Release the response before retrying, then use a short exponential
      // backoff with jitter to avoid retry storms during provider load.
      await response.text().catch(() => '');
    } catch (error) {
      lastError = error;
      if (attempt === GEMINI_MAX_ATTEMPTS - 1) throw error;
    }

    await sleep(600 * 2 ** attempt + Math.floor(Math.random() * 250));
  }

  throw lastError instanceof Error ? lastError : new Error('Gemini request failed.');
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

  // This is a stateless, weather-only lookup. Excluding prior conversation
  // turns avoids unnecessary model context and thought-signature overhead.
  const contents = [{ role: 'user', parts: [{ text: message }] }];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const payload = {
    systemInstruction: { parts: [{ text: systemInstruction }] },
    contents,
    generationConfig: {
      temperature: 0.2,
      // The assistant is intentionally limited to one or two short sentences.
      maxOutputTokens: 64,
      thinkingConfig: { thinkingLevel: 'minimal' },
    },
  };

  try {
    const geminiRes = await fetchGemini(url, payload);

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
