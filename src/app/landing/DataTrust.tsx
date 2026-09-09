'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  TrendingUp,
  Activity,
  Brain,
  FlaskConical,
  Clock,
  Database,
  BarChart2,
} from 'lucide-react';

const TRUST_STATES = [
  {
    key: 'OFFICIAL',
    icon: <ShieldCheck size={16} />,
    color: 'text-primary bg-primary/8 border-primary/20',
    desc: 'Issued by a government agency (IMD, NDMA, CWC). Authoritative and unmodified.',
  },
  {
    key: 'FORECAST',
    icon: <TrendingUp size={16} />,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    desc: 'Numerical weather prediction output. Probabilistic — not a guarantee.',
  },
  {
    key: 'OBSERVED',
    icon: <Activity size={16} />,
    color: 'text-success bg-success/8 border-success/20',
    desc: 'Measured by instruments. Reflects actual conditions at time of observation.',
  },
  {
    key: 'AI INTERPRETATION',
    icon: <Brain size={16} />,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    desc: 'AkashVani AI analysis. Helpful context — not an official warning.',
  },
  {
    key: 'DEMO',
    icon: <FlaskConical size={16} />,
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    desc: 'Simulated data for demonstration. Not real weather or official information.',
  },
];

export default function DataTrust() {
  return (
    <section id="data-trust" className="py-16 lg:py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Know what you're looking at.
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
            Every data element in AkashVani is clearly labeled with its source type and provenance.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          {TRUST_STATES?.map((t, i) => (
            <motion.div
              key={t?.key}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold mb-3 ${t?.color}`}>
                {t?.icon}
                {t?.key}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{t?.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Metadata example */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="bg-card border border-border rounded-xl p-4 max-w-xl"
        >
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Example Data Provenance</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <Database size={12} />, label: 'Source', value: 'IMD Safdarjung' },
              { icon: <Clock size={12} />, label: 'Updated', value: '5 min ago' },
              { icon: <Activity size={12} />, label: 'Data Type', value: 'OBSERVED' },
              { icon: <BarChart2 size={12} />, label: 'Confidence', value: 'High' },
            ]?.map((item) => (
              <div key={item?.label} className="flex items-start gap-1.5">
                <span className="text-muted-foreground mt-0.5">{item?.icon}</span>
                <div>
                  <p className="text-[9px] text-muted-foreground">{item?.label}</p>
                  <p className="text-xs font-semibold text-foreground">{item?.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
