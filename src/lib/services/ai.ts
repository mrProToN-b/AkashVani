// ---------------------------------------------------------------------------
// AkashVani AI service
// ---------------------------------------------------------------------------
// Thin client for /api/assistant. Every AkashVani "service" follows the same
// result shape so components can render loading/success/error/empty states
// consistently instead of scattering fetch() + try/catch everywhere.
// ---------------------------------------------------------------------------

export type ServiceStatus = 'loading' | 'success' | 'error' | 'empty' | 'stale';

export interface ServiceResult<T> {
  status: ServiceStatus;
  data?: T;
  error?: string;
}

export interface ChatTurn {
  role: 'user' | 'assistant';
  text: string;
}

export interface AssistantContext {
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

export interface AssistantAnswer {
  text: string;
  model: string;
  generatedAt: string;
  factors: string[];
}

async function callAssistant(
  message: string,
  opts: { history?: ChatTurn[]; context?: AssistantContext; mode?: 'chat' | 'explain_alert' | 'summarize_weather' } = {}
): Promise<ServiceResult<AssistantAnswer>> {
  try {
    const res = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: opts.history || [],
        context: opts.context || {},
        mode: opts.mode || 'chat',
      }),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok || !json || json.status !== 'success') {
      return {
        status: 'error',
        error: json?.error || 'AkashVani AI is temporarily unavailable. Please try again shortly.',
      };
    }

    return { status: 'success', data: json.data as AssistantAnswer };
  } catch {
    return {
      status: 'error',
      error: 'Unable to reach AkashVani AI. Check your connection and try again.',
    };
  }
}

/** General context-aware chat turn. */
export function askAssistant(message: string, history: ChatTurn[], context: AssistantContext) {
  return callAssistant(message, { history, context, mode: 'chat' });
}

/** "What this warning means / Why you're seeing it / What to do / Source info" for one alert. */
export function explainAlert(context: AssistantContext) {
  return callAssistant('Explain this official warning for me.', { context, mode: 'explain_alert' });
}

/** Short plain-language summary card (replaces the old static AI summary). */
export function summarizeWeather(context: AssistantContext) {
  return callAssistant('Summarize today\'s weather and risk for me.', { context, mode: 'summarize_weather' });
}
