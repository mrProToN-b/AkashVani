'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Wind,
  Droplets,
  Thermometer,
  CloudRain,
  Navigation,
  Activity,
  Map,
} from 'lucide-react';

const TIMELINE = ['NOW', '+3H', '+6H', '+12H', 'TOMORROW'];

function WeatherMapViz() {
  return (
    <div className="relative w-full h-full bg-[#0D1B2A] rounded-xl overflow-hidden border border-white/10">
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4B9FE1" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* India map outline (simplified SVG path) */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 420" preserveAspectRatio="xMidYMid meet">
        {/* Simplified India shape */}
        <path
          d="M 160 60 L 200 50 L 240 60 L 270 80 L 290 110 L 300 140 L 295 170 L 310 200 L 305 230 L 285 260 L 260 290 L 240 320 L 220 350 L 200 370 L 185 350 L 165 320 L 145 290 L 125 260 L 110 230 L 105 200 L 115 170 L 110 140 L 120 110 L 140 80 Z"
          fill="none"
          stroke="#4B9FE1"
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />
        {/* Rainfall contours */}
        <ellipse cx="200" cy="200" rx="80" ry="70" fill="rgba(6,182,212,0.08)" stroke="rgba(6,182,212,0.3)" strokeWidth="1" strokeDasharray="4 3" />
        <ellipse cx="200" cy="200" rx="55" ry="48" fill="rgba(6,182,212,0.12)" stroke="rgba(6,182,212,0.4)" strokeWidth="1" strokeDasharray="4 3" />
        <ellipse cx="200" cy="200" rx="30" ry="26" fill="rgba(6,182,212,0.18)" stroke="rgba(6,182,212,0.5)" strokeWidth="1" />

        {/* Wind vectors */}
        {[
          [150, 150], [180, 130], [220, 145], [250, 160],
          [160, 200], [230, 210], [170, 250], [240, 240],
        ]?.map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y}) rotate(${-30 + i * 15})`}>
            <line x1="0" y1="0" x2="14" y2="0" stroke="#06B6D4" strokeWidth="1.2" strokeOpacity="0.7" />
            <polygon points="14,0 10,-3 10,3" fill="#06B6D4" fillOpacity="0.7" />
          </g>
        ))}

        {/* Location marker */}
        <circle cx="200" cy="195" r="6" fill="#0F52BA" fillOpacity="0.9" />
        <circle cx="200" cy="195" r="12" fill="none" stroke="#0F52BA" strokeWidth="1.5" strokeOpacity="0.5" />
        <circle cx="200" cy="195" r="18" fill="none" stroke="#0F52BA" strokeWidth="1" strokeOpacity="0.25" />

        {/* Risk region */}
        <path
          d="M 170 160 Q 200 140 230 160 Q 250 185 230 210 Q 200 225 170 210 Q 150 185 170 160 Z"
          fill="rgba(245,158,11,0.08)"
          stroke="rgba(245,158,11,0.4)"
          strokeWidth="1"
          strokeDasharray="5 3"
        />
      </svg>

      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2.5 bg-[#0D1B2A]/80 border-b border-white/10">
        <span className="text-xs font-semibold text-cyan-400 tracking-widest uppercase">Weather Intelligence</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-green-400 font-medium">LIVE</span>
        </div>
      </div>

      {/* Bottom metrics bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#0D1B2A]/90 border-t border-white/10 px-4 py-2.5">
        {/* Timeline */}
        <div className="flex items-center gap-1 mb-2">
          {TIMELINE?.map((t, i) => (
            <React.Fragment key={t}>
              <button
                className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  i === 0 ? 'bg-primary text-white' : 'text-white/50 hover:text-white/80'
                } transition-colors`}
              >
                {t}
              </button>
              {i < TIMELINE?.length - 1 && (
                <div className="flex-1 h-px bg-white/10" />
              )}
            </React.Fragment>
          ))}
        </div>
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center gap-1.5">
            <Thermometer size={12} className="text-orange-400" />
            <span className="text-white font-bold text-sm font-mono">31°C</span>
            <span className="text-white/40 text-[10px]">Feels 36°</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Droplets size={12} className="text-cyan-400" />
            <span className="text-white font-bold text-sm font-mono">Rain 65%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity size={12} className="text-amber-400" />
            <span className="text-white font-bold text-sm font-mono">Risk 42</span>
          </div>
        </div>
      </div>

      {/* Location label */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#0D1B2A]/80 border border-white/15 rounded-full px-2.5 py-1">
        <MapPin size={10} className="text-primary" />
        <span className="text-[10px] text-white/80 font-medium">Kolkata</span>
      </div>

      {/* Wind label */}
      <div className="absolute top-16 right-4 bg-[#0D1B2A]/70 border border-cyan-500/20 rounded px-2 py-1">
        <div className="flex items-center gap-1">
          <Wind size={10} className="text-cyan-400" />
          <span className="text-[10px] text-cyan-300 font-mono">18 km/h SW</span>
        </div>
      </div>

      {/* Rainfall label */}
      <div className="absolute top-24 left-4 bg-[#0D1B2A]/70 border border-cyan-500/20 rounded px-2 py-1">
        <div className="flex items-center gap-1">
          <CloudRain size={10} className="text-cyan-400" />
          <span className="text-[10px] text-cyan-300 font-mono">Rainfall Field</span>
        </div>
      </div>

      {/* Risk indicator */}
      <div className="absolute top-36 right-4 bg-amber-900/40 border border-amber-500/30 rounded px-2 py-1">
        <span className="text-[10px] text-amber-300 font-mono">⚠ Risk Zone</span>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden bg-background pt-12 pb-16 lg:pt-16 lg:pb-20">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/20 rounded-full px-3 py-1 mb-5">
              <Navigation size={12} className="text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide">AI-Powered Weather Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
              Weather that{' '}
              <span className="text-primary">understands</span>{' '}
              you.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-3 max-w-xl">
              Real-time weather, scientific forecasts, official disaster information and AI-powered guidance tailored to your location.
            </p>

            <p className="text-sm text-muted-foreground/70 mb-8 font-medium tracking-wide">
              Understand → Predict → Explain → Prepare → Act
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
              >
                Get Started
              </Link>
              <a
                href="#live-map"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-card border border-border text-foreground font-semibold rounded-xl hover:bg-secondary transition-all"
              >
                <Map size={16} />
                Explore Live Map
              </a>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-muted-foreground font-medium rounded-xl hover:bg-secondary transition-all"
              >
                Login
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-border">
              {[
                { label: 'Weather Models', value: '5+' },
                { label: 'Indian Languages', value: '12' },
                { label: 'Data Sources', value: '8+' },
              ]?.map((item) => (
                <div key={item?.label} className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary font-mono">{item?.value}</span>
                  <span className="text-xs text-muted-foreground">{item?.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Weather Map Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="h-[420px] lg:h-[480px]"
          >
            <WeatherMapViz />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
