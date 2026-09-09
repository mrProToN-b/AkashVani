'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Volume2, Bookmark, Share2, Sparkles, RotateCw, AlertCircle } from 'lucide-react';
import { DEMO_WEATHER, DEMO_RISK, DEMO_AQI, DEMO_ALERTS } from '@/lib/mockData';
import { summarizeWeather } from '@/lib/services/ai';
import { useVoiceAssistant } from '@/lib/hooks/useVoiceAssistant';

type CardState = 'loading' | 'success' | 'error';

export default function AISummaryCard() {
  const [state, setState] = useState<CardState>('loading');
  const [text, setText] = useState('');
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [error, setError] = useState('');

  const voice = useVoiceAssistant({ onFinalTranscript: async () => '' });

  const load = async () => {
    setState('loading');
    // NOTE: the weather/risk/AQI/alert values fed in here are still preview data —
    // Phase 2 wires this to a live weather provider. The card is honest about that below.
    const result = await summarizeWeather({
      locationName: DEMO_WEATHER.location,
      weather: DEMO_WEATHER,
      risk: DEMO_RISK,
      aqi: DEMO_AQI,
      alerts: DEMO_ALERTS,
      persona: 'Default',
      language: 'English',
    });

    if (result.status === 'success' && result.data) {
      setText(result.data.text);
      setGeneratedAt(result.data.generatedAt);
      setState('success');
    } else {
      setError(result.error || 'AI summary is unavailable right now.');
      setState('error');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-card h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center">
            <Sparkles size={16} className="text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">AkashVani AI Summary</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="ai-badge text-[10px] font-semibold px-1.5 py-0.5 rounded-full">AI INTERPRETATION</span>
              <span className="text-[10px] text-muted-foreground">Not an official alert</span>
            </div>
          </div>
        </div>
        <button
          onClick={load}
          disabled={state === 'loading'}
          title="Refresh summary"
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground disabled:opacity-50"
        >
          <RotateCw size={14} className={state === 'loading' ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Body */}
      {state === 'loading' && (
        <div className="flex-1 space-y-2 animate-pulse">
          <div className="h-3 bg-secondary rounded w-full" />
          <div className="h-3 bg-secondary rounded w-11/12" />
          <div className="h-3 bg-secondary rounded w-4/5" />
        </div>
      )}

      {state === 'error' && (
        <div className="flex-1 flex items-start gap-2 bg-warning/10 border border-warning/25 rounded-xl p-3">
          <AlertCircle size={14} className="text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-foreground">AI summary unavailable</p>
            <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {state === 'success' && (
        <p className="text-sm text-foreground leading-relaxed flex-1">{text}</p>
      )}

      {/* Sources */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {['Weather data', 'Risk assessment', 'AQI', 'Active alerts'].map((src) => (
          <span key={src} className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">
            {src}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-3 pt-3 border-t border-border/60 flex items-center gap-2 flex-wrap">
        <button
          onClick={() => state === 'success' && voice.speak(text)}
          disabled={state !== 'success'}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          <Volume2 size={13} /> Read Aloud
        </button>
        <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded-lg transition-colors">
          <Bookmark size={13} /> Save
        </button>
        <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded-lg transition-colors">
          <Share2 size={13} /> Share
        </button>
        <Link
          href="/user-dashboard/assistant"
          className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-lg transition-colors ml-auto"
        >
          <MessageSquare size={13} /> Ask Follow-up
        </Link>
      </div>

      <p className="text-[10px] text-muted-foreground mt-2">
        {state === 'success' && generatedAt
          ? `Generated ${new Date(generatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST`
          : state === 'loading'
          ? 'Generating…'
          : 'Not generated'}
      </p>
    </div>
  );
}
