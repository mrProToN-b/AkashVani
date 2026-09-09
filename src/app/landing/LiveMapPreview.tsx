'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Map,
  Droplets,
  Wind,
  Layers3,
  ChevronDown,
  Navigation,
} from 'lucide-react';
import Link from 'next/link';

const CONTROLS = [
  { label: 'MODEL', value: 'GEMINI 3.5' },
  { label: 'PARAMETER', value: 'Rainfall' },
  { label: 'TIME', value: '+6H' },
  { label: 'LAYER', value: 'Radar' },
];

const TIMELINE = ['NOW', '+3H', '+6H', '+12H', 'TOMORROW'];

function ScientificMapViz() {
  const [activeTime, setActiveTime] = useState(0);

  return (
    <div className="relative w-full h-full bg-[#0D1B2A] rounded-xl overflow-hidden border border-white/10">
      {/* Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-8" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="mapgrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#4B9FE1" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapgrid)" />
      </svg>

      {/* India map */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 520" preserveAspectRatio="xMidYMid meet">
        <path
          d="M 200 70 L 250 58 L 300 72 L 335 100 L 355 135 L 365 175 L 358 215 L 375 255 L 368 295 L 345 330 L 315 365 L 290 400 L 265 435 L 250 455 L 232 435 L 205 400 L 180 365 L 155 330 L 135 295 L 128 255 L 138 215 L 130 175 L 142 135 L 165 100 Z"
          fill="rgba(15,82,186,0.06)"
          stroke="#4B9FE1"
          strokeWidth="1.5"
          strokeOpacity="0.5"
        />
        {/* Rainfall zones */}
        <ellipse cx="250" cy="250" rx="100" ry="90" fill="rgba(6,182,212,0.06)" stroke="rgba(6,182,212,0.25)" strokeWidth="1" strokeDasharray="5 4" />
        <ellipse cx="250" cy="250" rx="65" ry="58" fill="rgba(6,182,212,0.10)" stroke="rgba(6,182,212,0.35)" strokeWidth="1" strokeDasharray="4 3" />
        <ellipse cx="250" cy="250" rx="35" ry="30" fill="rgba(6,182,212,0.16)" stroke="rgba(6,182,212,0.5)" strokeWidth="1" />

        {/* Wind vectors */}
        {[
          [185, 185], [220, 165], [270, 180], [310, 200],
          [195, 245], [285, 260], [210, 305], [295, 300],
          [165, 280], [330, 240],
        ]?.map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y}) rotate(${-25 + i * 12})`}>
            <line x1="0" y1="0" x2="16" y2="0" stroke="#06B6D4" strokeWidth="1.2" strokeOpacity="0.65" />
            <polygon points="16,0 12,-3 12,3" fill="#06B6D4" fillOpacity="0.65" />
          </g>
        ))}

        {/* Location marker */}
        <circle cx="250" cy="245" r="7" fill="#0F52BA" fillOpacity="0.9" />
        <circle cx="250" cy="245" r="14" fill="none" stroke="#0F52BA" strokeWidth="1.5" strokeOpacity="0.4" />
        <circle cx="250" cy="245" r="22" fill="none" stroke="#0F52BA" strokeWidth="1" strokeOpacity="0.2" />

        {/* Risk zone */}
        <path
          d="M 215 200 Q 250 178 285 200 Q 308 228 285 258 Q 250 272 215 258 Q 192 228 215 200 Z"
          fill="rgba(245,158,11,0.07)"
          stroke="rgba(245,158,11,0.35)"
          strokeWidth="1"
          strokeDasharray="5 3"
        />

        {/* City dots */}
        {[
          [250, 245, 'Kolkata'],
          [195, 360, 'Mumbai'],
          [270, 390, 'Hyderabad'],
          [260, 430, 'Chennai'],
          [320, 310, 'Kolkata'],
        ]?.map(([x, y, name], i) => (
          <g key={`${String(name)}-${x}-${y}-${i}`}>
            <circle cx={Number(x)} cy={Number(y)} r="3" fill="#4B9FE1" fillOpacity="0.7" />
            <text x={Number(x) + 6} y={Number(y) + 4} fontSize="9" fill="rgba(255,255,255,0.5)" fontFamily="monospace">{String(name)}</text>
          </g>
        ))}
      </svg>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-[#0D1B2A]/85 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Map size={14} className="text-cyan-400" />
          <span className="text-xs font-semibold text-cyan-400 tracking-widest uppercase">Live Map Preview</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Droplets size={11} className="text-cyan-400" />
            <span className="text-[10px] text-white/60 font-mono">Rainfall</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind size={11} className="text-cyan-400" />
            <span className="text-[10px] text-white/60 font-mono">Wind</span>
          </div>
          <div className="demo-badge text-[9px] font-semibold px-1.5 py-0.5 rounded">LIVE</div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-16 left-3 bg-[#0D1B2A]/80 border border-white/10 rounded-lg px-3 py-2">
        <p className="text-[9px] text-white/50 font-mono mb-1.5 uppercase tracking-wider">Rainfall (mm/h)</p>
        <div className="flex items-center gap-1">
          {['#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6']?.map((c, i) => (
            <div key={i} className="w-5 h-2 rounded-sm" style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="flex justify-between mt-0.5">
          <span className="text-[8px] text-white/40 font-mono">0</span>
          <span className="text-[8px] text-white/40 font-mono">50+</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#0D1B2A]/90 border-t border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-1">
          {TIMELINE?.map((t, i) => (
            <React.Fragment key={t}>
              <button
                onClick={() => setActiveTime(i)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${
                  activeTime === i ? 'bg-primary text-white' : 'text-white/50 hover:text-white/80'
                }`}
              >
                {t}
              </button>
              {i < TIMELINE?.length - 1 && <div className="flex-1 h-px bg-white/10" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Source */}
      <div className="absolute bottom-12 right-3 text-[9px] text-white/30 font-mono">
        LIVE · {new Date()?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
      </div>
    </div>
  );
}

export default function LiveMapPreview() {
  return (
    <section id="live-map" className="py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            See weather, not just numbers.
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
            Interactive weather map with scientific controls, multiple layers and forecast timeline.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-4">
          {/* Controls panel */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border rounded-xl p-4 space-y-3 lg:col-span-1"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Layers3 size={14} className="text-primary" />
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Map Controls</span>
            </div>
            {CONTROLS?.map((c) => (
              <div key={c?.label}>
                <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-1">{c?.label}</p>
                <button className="w-full flex items-center justify-between px-2.5 py-1.5 bg-secondary border border-border rounded-lg text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors">
                  {c?.value}
                  <ChevronDown size={12} className="text-muted-foreground" />
                </button>
              </div>
            ))}

            <div className="pt-2 border-t border-border">
              <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Region</p>
              <button className="w-full flex items-center justify-between px-2.5 py-1.5 bg-secondary border border-border rounded-lg text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors">
                India
                <ChevronDown size={12} className="text-muted-foreground" />
              </button>
            </div>

            <div className="pt-2 border-t border-border">
              <button className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-medium text-muted-foreground hover:text-primary transition-colors">
                <Navigation size={11} />
                My Location
              </button>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3 h-[400px] lg:h-[480px]"
          >
            <ScientificMapViz />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-6 text-center"
        >
          <Link
            href="/live-weather-map"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm"
          >
            <Map size={16} />
            Explore Live Map
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
