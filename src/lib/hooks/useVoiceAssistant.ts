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

function findPreferredVoice(locale: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  const normalizedLocale = locale.toLowerCase();
  const baseLanguage = normalizedLocale.split('-')[0];

  // Prefer the exact Indian locale, then any installed voice for the same
  // language (for example bn-BD when bn-IN is not installed).
  return (
    voices.find((voice) => voice.lang.toLowerCase() === normalizedLocale) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith(`${baseLanguage}-`)) ||
    voices.find((voice) => voice.lang.toLowerCase() === baseLanguage)
  );
}

export function useVoiceAssistant({ language = 'en-IN', onFinalTranscript }: UseVoiceAssistantOptions) {
  const [state, setState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [lastAnswer, setLastAnswer] = useState('');
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const stoppedManually = useRef(false);
  const isProcessingRef = useRef(false);
  const permissionGrantedRef = useRef(false);
  const onFinalTranscriptRef = useRef(onFinalTranscript);

  const isSupported =
    typeof window !== 'undefined' &&
    (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window)) &&
    'speechSynthesis' in window;

  useEffect(() => {
    if (!isSupported) {
      setState('unsupported');
    }
  }, [isSupported]);

  useEffect(() => {
    onFinalTranscriptRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    // Calling getVoices primes Chrome/Edge's asynchronous voice catalogue so
    // Hindi and Bengali voices are available before the first reply arrives.
    window.speechSynthesis.getVoices();
    const preloadVoices = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener('voiceschanged', preloadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', preloadVoices);
  }, []);

  /** Request mic access from a user-initiated action before recognition starts. */
  const requestMicrophonePermission = useCallback(async () => {
    if (!isSupported || !navigator.mediaDevices?.getUserMedia) {
      setState('unsupported');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      permissionGrantedRef.current = true;
      return true;
    } catch {
      setState('permission_denied');
      return false;
    }
  }, [isSupported]);

  const speak = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) return;
      stoppedManually.current = false;
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      const voice = findPreferredVoice(language);
      if (voice) utterance.voice = voice;
      utterance.rate = 1;
      utteranceRef.current = utterance;

      utterance.onstart = () => {
        if (utteranceRef.current === utterance) setState('speaking');
      };
      utterance.onend = () => {
        if (utteranceRef.current === utterance && !stoppedManually.current) setState('idle');
      };
      utterance.onerror = () => {
        if (utteranceRef.current === utterance) setState('idle');
      };

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

  const startListening = useCallback(async () => {
    if (!isSupported) {
      setState('unsupported');
      return;
    }
    if (isProcessingRef.current || recognitionRef.current || state === 'listening') return;

    if (!permissionGrantedRef.current) {
      const permitted = await requestMicrophonePermission();
      if (!permitted) return;
    }
    // Interrupt any speech in progress first.
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    // There can only be one recognition instance at a time. This prevents
    // duplicate transcripts and duplicate requests after a live-voice turn.

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

      if (finalText.trim() && !isProcessingRef.current) {
        isProcessingRef.current = true;
        recognition.stop();
        setState('thinking');
        onFinalTranscriptRef.current(finalText.trim())
          .then((answer) => {
            const response = answer.trim() || 'Sorry, I could not prepare a weather answer just now.';
            setLastAnswer(response);
            speak(response);
          })
          .catch(() => {
            const fallback = 'Sorry, I could not process that just now.';
            setLastAnswer(fallback);
            speak(fallback);
          })
          .finally(() => {
            isProcessingRef.current = false;
          });
      }
    };

    recognition.onerror = (ev: Event & { error?: string }) => {
      if (ev.error === 'not-allowed' || ev.error === 'permission-denied') {
        permissionGrantedRef.current = false;
        setState('permission_denied');
      } else if (ev.error !== 'aborted') {
        setState('idle');
      }
    };

    recognition.onend = () => {
      if (recognitionRef.current === recognition) recognitionRef.current = null;
      // If we're still listening when it ends without a result, return to idle.
      setState((prev) => (prev === 'listening' ? 'idle' : prev));
    };

    try {
      recognition.start();
      setState('listening');
      setTranscript('');
    } catch {
      if (recognitionRef.current === recognition) recognitionRef.current = null;
      setState('idle');
    }
  }, [isSupported, language, requestMicrophonePermission, speak, state]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
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
    requestMicrophonePermission,
    startListening,
    stopListening,
    interrupt,
    speak,
  };
}
