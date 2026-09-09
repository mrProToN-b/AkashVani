'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gauge, HelpCircle } from 'lucide-react';

const RISK_SCORE = 42;
const BREAKDOWN = [
  { label: 'Rain', score: 56, color: '#06B6D4' },
  { label: 'Flood', score: 32, color: '#3B82F6' },
  { label: 'Wind', score: 28, color: '#8B5CF6' },
  { label: 'Heat', score: 41, color: '#F97316' },
  { label: 'AQI', score: 27, color: '#10B981' },
];

function RadialScore({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--secondary)" strokeWidth="10" />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#F59E0B"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground font-mono">{score}</span>
        <span className="text-[10px] text-muted-foreground font-medium">/ 100</span>
        <span className="text-[10px] font-semibold text-amber-600 mt-0.5">Moderate</span>
      </div>
    </div>
  );
}

export default function WeatherRisk() {
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
            Know your weather risk before you step outside.
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            A unified risk score combining multiple weather hazards, updated continuously.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="grid sm:grid-cols-2 gap-6 items-center">
              {/* Radial */}
              <div>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest text-center mb-3">Overall Risk</p>
                <RadialScore score={RISK_SCORE} />
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <Gauge size={12} className="text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Kolkata · Live Data</span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground">Risk Breakdown</span>
                  <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors">
                    <HelpCircle size={11} />
                    Why this risk?
                  </button>
                </div>
                {BREAKDOWN.map((item, i) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-10 flex-shrink-0">{item.label}</span>
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.score}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                    <span className="text-xs font-mono font-semibold text-foreground w-6 text-right">{item.score}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Why this score?</span>{' '}
                Risk is moderate due to afternoon rainfall probability (56%) and elevated heat index (41°C feels-like). No severe weather warnings active.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
