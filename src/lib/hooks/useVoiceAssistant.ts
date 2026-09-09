'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Minimal ambient types for the Web Speech API (not in default TS DOM libs).
// ---------------------------------------------------------------------------
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechRecognitionEventLike extends Event {
  results: ArrayLike<SpeechRecognitionResultLike>;
  resultIndex: number;
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((ev: Event & { error?: string }) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

export type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'interrupted' | 'unsupported' | 'permission_denied';

interface UseVoiceAssistantOptions {
  language?: string; // BCP-47, e.g. 'en-IN', 'hi-IN'
  onFinalTranscript: (transcript: string) => Promise<string>; // returns the answer text to speak
}

export function useVoiceAssistant({ language = 'en-IN', onFinalTranscript }: UseVoiceAssistantOptions) {
  const [state, setState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [lastAnswer, setLastAnswer] = useState('');
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const stoppedManually = useRef(false);

  const isSupported =
    typeof window !== 'undefined' &&
    (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window)) &&
    'speechSynthesis' in window;

  useEffect(() => {
    if (!isSupported) {
      setState('unsupported');
    }
  }, [isSupported]);

  const speak = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 1;
      utteranceRef.current = utterance;

      utterance.onstart = () => setState('speaking');
      utterance.onend = () => {
        if (!stoppedManually.current) setState('idle');
      };
      utterance.onerror = () => setState('idle');

      window.speechSynthesis.speak(utterance);
    },
    [language]
  );

  /** STOP: immediately halts audio playback and returns control to the mic — no reload needed. */
  const interrupt = useCallback(() => {
    stoppedManually.current = true;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setState('interrupted');
    // Hand control straight back to the microphone.
    setTimeout(() => {
      stoppedManually.current = false;
      setState('idle');
    }, 150);
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setState('unsupported');
      return;
    }
    // Interrupt any speech in progress first.
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    const RecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!RecognitionCtor) {
      setState('unsupported');
      return;
    }

    const recognition = new RecognitionCtor();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onresult = (ev: SpeechRecognitionEventLike) => {
      let finalText = '';
      let interimText = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const res = ev.results[i];
        if (res.isFinal) finalText += res[0].transcript;
        else interimText += res[0].transcript;
      }
      setTranscript(finalText || interimText);

      if (finalText.trim()) {
        setState('thinking');
        onFinalTranscript(finalText.trim())
          .then((answer) => {
            setLastAnswer(answer);
            speak(answer);
          })
          .catch(() => {
            setLastAnswer('Sorry, I could not process that just now.');
            speak('Sorry, I could not process that just now.');
          });
      }
    };

    recognition.onerror = (ev: Event & { error?: string }) => {
      if (ev.error === 'not-allowed' || ev.error === 'permission-denied') {
        setState('permission_denied');
      } else {
        setState('idle');
      }
    };

    recognition.onend = () => {
      // If we're still "listening" when it ends (no result captured), go back to idle.
      setState((prev) => (prev === 'listening' ? 'idle' : prev));
    };

    try {
      recognition.start();
      setState('listening');
      setTranscript('');
    } catch {
      setState('idle');
    }
  }, [isSupported, language, onFinalTranscript, speak]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setState('idle');
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  return {
    state,
    transcript,
    lastAnswer,
    isSupported,
    startListening,
    stopListening,
    interrupt,
    speak,
  };
}
