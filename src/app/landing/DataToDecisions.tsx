'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  TrendingUp,
  MessageCircle,
  ShieldAlert,
  BookOpen,
  Zap,
  ArrowDown,
} from 'lucide-react';

const STEPS = [
  { icon: <Eye size={20} />, label: 'Observe', desc: 'Collect real-time weather observations from surface stations, radar and satellite.' },
  { icon: <TrendingUp size={20} />, label: 'Predict', desc: 'Run numerical weather models and ensemble forecasts for your location.' },
  { icon: <MessageCircle size={20} />, label: 'Explain', desc: 'AI translates complex meteorological data into plain language you understand.' },
  { icon: <ShieldAlert size={20} />, label: 'Assess Risk', desc: 'Combine forecasts, observations and official alerts into a unified risk score.' },
  { icon: <BookOpen size={20} />, label: 'Prepare', desc: 'Receive personalized preparation guidance based on your profile and location.' },
  { icon: <Zap size={20} />, label: 'Act', desc: 'Take informed decisions with confidence — from daily plans to emergency response.' },
];

export default function DataToDecisions() {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            From weather data to weather decisions.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            AkashVani turns complex weather and disaster information into clear, understandable and actionable guidance.
          </p>
        </motion.div>

        {/* Flow — asymmetric layout */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STEPS?.map((step, i) => (
            <motion.div
              key={step?.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="relative bg-card border border-border rounded-xl p-5 hover:shadow-card transition-shadow group"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  {step?.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-muted-foreground">0{i + 1}</span>
                    <h3 className="text-sm font-semibold text-foreground">{step?.label}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step?.desc}</p>
                </div>
              </div>
              {i < STEPS?.length - 1 && i % 3 !== 2 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-4 h-px bg-border" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Flow arrow summary */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          {STEPS?.map((s, i) => (
            <React.Fragment key={s?.label}>
              <span className="font-semibold text-foreground">{s?.label}</span>
              {i < STEPS?.length - 1 && <ArrowDown size={12} className="rotate-[-90deg] text-muted-foreground/50" />}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
