'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Tractor,
  Anchor,
  Plane,
  Trees,
  User,
} from 'lucide-react';

type PersonaKey = 'default' | 'urban' | 'rural' | 'farmer' | 'marine' | 'aviation';

const PERSONAS: { key: PersonaKey; label: string; icon: React.ReactNode }[] = [
  { key: 'default', label: 'Default', icon: <User size={14} /> },
  { key: 'urban', label: 'Urban', icon: <Building2 size={14} /> },
  { key: 'rural', label: 'Rural', icon: <Trees size={14} /> },
  { key: 'farmer', label: 'Farmer', icon: <Tractor size={14} /> },
  { key: 'marine', label: 'Marine', icon: <Anchor size={14} /> },
  { key: 'aviation', label: 'Aviation', icon: <Plane size={14} /> },
];

const PERSONA_CONTENT: Record<PersonaKey, { metrics: { label: string; value: string; sub?: string }[]; summary: string }> = {
  default: {
    metrics: [
      { label: 'Weather', value: '31°C', sub: 'Partly Cloudy' },
      { label: 'Forecast', value: 'Rain', sub: 'After 5 PM' },
      { label: 'Risk', value: '42/100', sub: 'Moderate' },
    ],
    summary: 'General weather forecast with risk overview and AI summary.',
  },
  urban: {
    metrics: [
      { label: 'Flood Risk', value: 'Moderate', sub: 'Zone B' },
      { label: 'AQI', value: '142', sub: 'Unhealthy' },
      { label: 'Heat Index', value: '38°C', sub: 'High' },
    ],
    summary: 'Urban-focused: flood risk, air quality, heat stress and commute weather.',
  },
  rural: {
    metrics: [
      { label: 'Rainfall', value: '18mm', sub: 'Expected' },
      { label: 'Thunderstorm', value: 'Likely', sub: 'Evening' },
      { label: 'Road Risk', value: 'Low', sub: 'NH-44' },
    ],
    summary: 'Rural focus: rainfall, thunderstorm alerts, road conditions and local warnings.',
  },
  farmer: {
    metrics: [
      { label: 'Rainfall', value: '22mm', sub: '48h outlook' },
      { label: 'Activity Window', value: '06–11 AM', sub: 'Best time' },
      { label: 'Humidity', value: '74%', sub: 'High' },
    ],
    summary: 'Farming forecast: rainfall outlook, best activity window and crop weather advisory.',
  },
  marine: {
    metrics: [
      { label: 'Wind', value: '24 kn', sub: 'SW' },
      { label: 'Wave Height', value: '1.8m', sub: 'Moderate' },
      { label: 'Marine Warning', value: 'None', sub: 'Demo' },
    ],
    summary: 'Marine conditions: wind, waves, swell, tides and sea-state forecast.',
  },
  aviation: {
    metrics: [
      { label: 'Visibility', value: '6.4 km', sub: 'CAVOK' },
      { label: 'Crosswind', value: '12 kn', sub: 'Acceptable' },
      { label: 'Cloud Ceiling', value: '3500 ft', sub: 'AGL' },
    ],
    summary: 'Aviation weather: visibility, crosswind, cloud ceiling and thunderstorm risk.',
  },
};

export default function PersonalizedWeather() {
  const [active, setActive] = useState<PersonaKey>('default');
  const content = PERSONA_CONTENT[active];

  return (
    <section className="py-16 lg:py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Weather that adapts to you.
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Choose your persona and AkashVani transforms the entire experience to match your needs.
          </p>
        </motion.div>

        {/* Persona tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {PERSONAS.map((p) => (
            <button
              key={p.key}
              onClick={() => setActive(p.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                active === p.key
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {p.icon}
              {p.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {PERSONAS.find((p) => p.key === active)?.icon}
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {PERSONAS.find((p) => p.key === active)?.label} Mode
                </span>
                <span className="ml-auto text-[9px] demo-badge px-1.5 py-0.5 rounded font-semibold">Demo</span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {content.metrics.map((m) => (
                  <div key={m.label} className="bg-secondary rounded-xl p-3 text-center">
                    <p className="text-[10px] text-muted-foreground mb-1">{m.label}</p>
                    <p className="text-base font-bold text-foreground font-mono">{m.value}</p>
                    {m.sub && <p className="text-[10px] text-muted-foreground mt-0.5">{m.sub}</p>}
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed text-center">
                {content.summary}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
