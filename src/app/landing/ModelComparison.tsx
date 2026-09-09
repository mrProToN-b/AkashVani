'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gauge } from 'lucide-react';

const MODELS = [
  { name: 'IMD', pct: 76, color: '#0F52BA' },
  { name: 'GFS', pct: 71, color: '#06B6D4' },
  { name: 'WRF', pct: 82, color: '#10B981' },
  { name: 'ECMWF', pct: 79, color: '#6366F1' },
];

const AGREEMENT = 80;

export default function ModelComparison() {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              See what the models are saying.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-md">
              AkashVani compares multiple numerical weather prediction models to show forecast confidence and highlight where models agree or diverge.
            </p>
            <div className="demo-badge inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <Gauge size={12} />
              Live Data 
            </div>
            <p className="text-xs text-muted-foreground italic">
              Models broadly agree on rainfall timing, while intensity varies.
            </p>
          </motion.div>

          {/* Right: visualization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            {/* Parameter label */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-0.5">Parameter</p>
                <p className="text-sm font-semibold text-foreground">Rainfall Probability</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-0.5">Valid</p>
                <p className="text-sm font-mono text-foreground">+6H</p>
              </div>
            </div>

            {/* Model bars */}
            <div className="space-y-3 mb-6">
              {MODELS?.map((m, i) => (
                <div key={m?.name} className="flex items-center gap-3">
                  <span className="text-xs font-mono font-semibold text-foreground w-14 flex-shrink-0">{m?.name}</span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${m?.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: m?.color }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-foreground w-8 text-right">{m?.pct}%</span>
                </div>
              ))}
            </div>

            {/* Agreement */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Model Agreement</span>
                <span className="text-xs font-semibold text-success">Confidence: High</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${AGREEMENT}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-muted-foreground">Low</span>
                <span className="text-[10px] font-mono text-foreground">{AGREEMENT}%</span>
                <span className="text-[10px] text-muted-foreground">High</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
