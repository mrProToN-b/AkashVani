'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  Mic,
  Square,
  X,
  Volume2,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  User as UserIcon,
  Sparkles,
} from 'lucide-react';
import {
  DEMO_WEATHER,
  PERSONAS,
  LANGUAGES,
} from '@/lib/mockData';
import { askAssistant, type AssistantContext } from '@/lib/services/ai';
import { useVoiceAssistant } from '@/lib/hooks/useVoiceAssistant';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  factors?: string[];
  isError?: boolean;
}

const SUGGESTED_QUESTIONS = [
  'Will it rain here after 5 PM?',
  'What is the weather in Maharashtra?',
  'Will it be hot in Rajasthan today?',
  'What is the forecast for Kerala?',
];

const VOICE_LANGUAGES = LANGUAGES.filter((language) =>
  ['en', 'hi', 'bn'].includes(language.code)
);
const VOICE_LOCALES: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  bn: 'bn-IN',
};

let idCounter = 0;
const nextId = () => `msg-${Date.now()}-${idCounter++}`;

export default function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nextId(),
      role: 'assistant',
      text: "Hi, I'm the AkashVani AI Assistant. Ask me for brief weather information about an Indian state or Union Territory.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [expandedFactors, setExpandedFactors] = useState<string | null>(null);
  const [language, setLanguage] = useState(VOICE_LANGUAGES[0]);
  const [persona, setPersona] = useState(PERSONAS[0]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isThinking]);

  // Send only the weather fields needed by the restricted assistant. This keeps
  // requests small and avoids asking the model to process unrelated dashboard data.
  const buildContext = (): AssistantContext => ({
    locationName: DEMO_WEATHER.location,
    weather: DEMO_WEATHER,
    persona: persona.label,
    language: `${language.label} (${VOICE_LOCALES[language.code]})`,
  });

  const sendMessage = async (text: string): Promise<string> => {
    const userMsg: Message = { id: nextId(), role: 'user', text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setIsThinking(true);

    // Weather lookups are intentionally stateless so each request stays fast
    // and cannot be slowed down by a growing chat transcript.
    const result = await askAssistant(text, [], buildContext());
    setIsThinking(false);

    if (result.status === 'success' && result.data) {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'assistant', text: result.data!.text, factors: result.data!.factors },
      ]);
      return result.data.text;
    }

    const errText = result.error || 'AkashVani AI is unavailable right now.';
    setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', text: errText, isError: true }]);
    return errText;
  };

  const voice = useVoiceAssistant({
    language: VOICE_LOCALES[language.code],
    onFinalTranscript: (t) => sendMessage(t),
  });

  const [liveVoiceOpen, setLiveVoiceOpen] = useState(false);
  const [liveVoicePaused, setLiveVoicePaused] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    sendMessage(input.trim());
  };

  // Continue the hands-free conversation after an answer has been spoken.
  useEffect(() => {
    if (liveVoicePaused || !liveVoiceOpen || (voice.state !== 'idle' && voice.state !== 'interrupted')) return;
    const restartTimer = window.setTimeout(() => voice.startListening(), 350);
    return () => window.clearTimeout(restartTimer);
  }, [liveVoiceOpen, liveVoicePaused, voice.state, voice.startListening]);

  const closeLiveVoice = () => {
    setLiveVoiceOpen(false);
    setLiveVoicePaused(false);
    voice.stopListening();
    voice.interrupt();
  };

  const readAloud = (text: string) => voice.speak(text);

  const micLabel =
    voice.state === 'listening'
      ? 'Listening…'
      : voice.state === 'thinking'
      ? 'Thinking…'
      : voice.state === 'speaking'
      ? 'Speaking…'
      : voice.state === 'permission_denied'
      ? 'Microphone blocked'
      : voice.state === 'unsupported'
      ? 'Voice not supported'
      : 'Tap to speak';

  return (
    <div className="bg-card border border-border rounded-2xl shadow-card flex flex-col h-[calc(100vh-9rem)] lg:h-[calc(100vh-7.5rem)] overflow-hidden">
      <AnimatePresence>
        {liveVoiceOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-md min-h-[480px] mx-4 bg-gradient-to-b from-slate-800 to-slate-950 border border-white/15 rounded-[2rem] p-7 flex flex-col items-center justify-between gap-5 shadow-2xl"
            >
              <button type="button" onClick={closeLiveVoice} aria-label="End live voice chat" className="absolute right-5 top-5 w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                <X size={18} />
              </button>
              <div className="text-center">
                <p className="text-xs font-semibold tracking-[0.2em] text-cyan-100/70 uppercase">AkashVani Live</p>
                <p className="mt-2 text-lg font-semibold text-white">{micLabel}</p>
              </div>
              <div className="relative flex items-center justify-center w-52 h-52">
                {[1, 2, 3].map((ring) => (
                  <motion.span
                    key={ring}
                    className="absolute rounded-full border border-cyan-300/30"
                    style={{ width: `${72 + ring * 34}px`, height: `${72 + ring * 34}px` }}
                    animate={voice.state === 'listening' || voice.state === 'speaking' ? { scale: [0.92, 1.08, 0.92], opacity: [0.2, 0.62, 0.2] } : { scale: 1, opacity: 0.2 }}
                    transition={{ repeat: Infinity, duration: 1.8 + ring * 0.25, delay: ring * 0.12, ease: 'easeInOut' }}
                  />
                ))}
                <motion.div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-300 via-primary to-violet-500 shadow-[0_0_60px_rgba(34,211,238,0.55)]"
                  animate={voice.state === 'listening' || voice.state === 'speaking' ? { scale: [1, 1.12, 0.96, 1], rotate: [0, 6, -6, 0] } : { scale: 1, rotate: 0 }}
                  transition={{ repeat: Infinity, duration: 1.35, ease: 'easeInOut' }}
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-end gap-1 h-12">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.span
                      key={i}
                      className="w-2 bg-primary rounded-full"
                      animate={{ height: ['25%', '100%', '25%'] }}
                      transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.08, ease: 'easeInOut' }}
                    />
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">{voice.state === 'thinking' ? 'Thinking' : voice.state === 'speaking' ? 'Speaking' : 'Listening'}</p>
                  <p className="text-xs text-white/65 truncate max-w-xs">
                    {voice.state === 'listening' ? voice.transcript || 'Speak naturally — I’ll reply and keep listening.' : voice.lastAnswer || 'Preparing your weather answer…'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (voice.state === 'speaking') {
                      voice.interrupt();
                    } else if (liveVoicePaused) {
                      setLiveVoicePaused(false);
                    } else {
                      setLiveVoicePaused(true);
                      voice.stopListening();
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20"
                >
                  <Square size={14} /> {voice.state === 'speaking' ? 'Interrupt' : liveVoicePaused ? 'Resume' : 'Pause'}
                </button>
                <button
                  type="button"
                  onClick={closeLiveVoice}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-danger text-white hover:bg-danger/90"
                >
                  <X size={14} /> End chat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Header */}
      <div className="flex items-center justify-between px-4 lg:px-5 py-3 border-b border-border bg-secondary/40 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">AkashVani AI Assistant</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="ai-badge text-[10px] font-semibold px-1.5 py-0.5 rounded-full">AI INTERPRETATION</span>
              <span className="text-[10px] text-muted-foreground">Persona: {persona.label}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={persona.id}
            onChange={(e) => setPersona(PERSONAS.find((p) => p.id === e.target.value) || PERSONAS[0])}
            className="text-xs bg-secondary border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring hidden sm:block"
          >
            {PERSONAS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.icon} {p.label}
              </option>
            ))}
          </select>
          <select
            value={language.id}
            onChange={(e) => setLanguage(VOICE_LANGUAGES.find((l) => l.id === e.target.value) || VOICE_LANGUAGES[0])}
            className="text-xs bg-secondary border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {VOICE_LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.native}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 lg:px-5 py-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : ''}`}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={14} className={m.isError ? 'text-warning' : 'text-primary'} />
              </div>
            )}
            <div className={`max-w-[85%] sm:max-w-md ${m.role === 'user' ? '' : 'flex-1'}`}>
              <div
                className={`text-sm rounded-xl px-4 py-2.5 leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-primary text-white rounded-tr-sm'
                    : m.isError
                    ? 'bg-warning/10 border border-warning/30 text-foreground rounded-tl-sm flex items-start gap-2'
                    : 'bg-secondary border border-border text-foreground rounded-tl-sm'
                }`}
              >
                {m.isError && <AlertCircle size={14} className="text-warning flex-shrink-0 mt-0.5" />}
                <span>{m.text}</span>
              </div>

              {m.role === 'assistant' && !m.isError && (
                <div className="flex items-center gap-3 mt-1.5 px-1">
                  <button
                    onClick={() => readAloud(m.text)}
                    className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Volume2 size={11} /> Read aloud
                  </button>
                  {m.factors && m.factors.length > 0 && (
                    <button
                      onClick={() => setExpandedFactors(expandedFactors === m.id ? null : m.id)}
                      className="flex items-center gap-1 text-[10px] text-primary font-medium hover:underline"
                    >
                      Why this answer?
                      {expandedFactors === m.id ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                    </button>
                  )}
                </div>
              )}

              <AnimatePresence>
                {expandedFactors === m.id && m.factors && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1.5 bg-accent/5 border border-accent/20 rounded-lg px-3 py-2 overflow-hidden"
                  >
                    <p className="text-[10px] font-semibold text-accent mb-1">Based on:</p>
                    <div className="flex flex-wrap gap-1">
                      {m.factors.map((f) => (
                        <span
                          key={f}
                          className="text-[9px] font-medium text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full border border-border capitalize"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <UserIcon size={14} className="text-primary" />
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-primary" />
            </div>
            <div className="flex items-center gap-2 bg-secondary border border-border rounded-xl px-4 py-2.5">
              <Loader2 size={13} className="animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">AkashVani is thinking…</span>
            </div>
          </div>
        )}

        {messages.length === 1 && (
          <div className="space-y-1.5 pt-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <Sparkles size={11} /> Try asking
            </p>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="block w-full text-left text-xs text-foreground bg-secondary/50 hover:bg-secondary rounded-xl px-3 py-2 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Voice state banner */}
      <AnimatePresence>
        {(voice.state === 'listening' || voice.state === 'speaking') && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex items-center justify-between gap-3 px-4 py-2 bg-primary/5 border-t border-primary/20 flex-shrink-0"
          >
            <div className="flex items-center gap-2">
              <div className="flex items-end gap-0.5 h-4">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1 bg-primary rounded-full"
                    animate={{ height: ['30%', '100%', '30%'] }}
                    transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.12, ease: 'easeInOut' }}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-primary">{micLabel}</span>
              {voice.transcript && voice.state === 'listening' && (
                <span className="text-xs text-muted-foreground truncate max-w-[160px]">"{voice.transcript}"</span>
              )}
            </div>
            {voice.state === 'speaking' && (
              <button
                onClick={voice.interrupt}
                className="flex items-center gap-1 text-xs font-semibold text-white bg-danger px-2.5 py-1 rounded-lg hover:bg-danger/90 transition-colors"
              >
                <Square size={11} /> Stop
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-border flex-shrink-0">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              voice.isSupported
                ? 'Ask AkashVani, or click the mic to speak…'
                : 'Ask AkashVani anything about the weather…'
            }
            className="w-full text-sm bg-input border border-border rounded-xl px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            onFocus={() => {}}
          />

          {voice.isSupported && (
            <button
              type="button"
              onClick={async () => {
                if (liveVoiceOpen) closeLiveVoice();
                else {
                  // Ask for microphone access before opening the live session.
                  // This makes the browser permission prompt predictable and
                  // avoids starting recognition without user consent.
                  const permitted = await voice.requestMicrophonePermission();
                  if (permitted) {
                    setLiveVoicePaused(false);
                    setLiveVoiceOpen(true);
                  }
                }
              }}
              title="Start live voice chat"
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-md flex items-center justify-center transition-colors disabled:opacity-50 ${
                liveVoiceOpen
                  ? 'bg-danger text-white'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
              }`}
            >
              {liveVoiceOpen && (
                <motion.span
                  className="absolute inset-0 rounded-md bg-danger/40"
                  animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'easeOut' }}
                />
              )}
              <Mic size={15} className="relative z-10" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isThinking}
          className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0 hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50"
        >
          <Send size={15} />
        </button>
      </form>

      {voice.state === 'permission_denied' && (
        <p className="text-[10px] text-warning px-4 pb-2 -mt-1">
          Microphone access was blocked. Allow it in your browser's site settings to use voice.
        </p>
      )}
      {voice.state === 'unsupported' && (
        <p className="text-[10px] text-muted-foreground px-4 pb-2 -mt-1">
          Voice interaction isn't supported in this browser. Try Chrome or Edge, or use text input above.
        </p>
      )}
    </div>
  );
}
