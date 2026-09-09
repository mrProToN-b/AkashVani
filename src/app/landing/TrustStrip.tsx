'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CloudSun,
  Activity,
  Radar,
  Satellite,
  TriangleAlert,
  Brain,
} from 'lucide-react';

const STRIPS = [
  { icon: <CloudSun size={16} />, label: 'Forecast Models', sub: 'IMD · GFS · WRF · ECMWF' },
  { icon: <Activity size={16} />, label: 'Weather Observations', sub: 'Surface · Upper Air' },
  { icon: <Radar size={16} />, label: 'Radar', sub: 'Doppler · Demo' },
  { icon: <Satellite size={16} />, label: 'Satellite', sub: 'INSAT-3D · Demo' },
  { icon: <TriangleAlert size={16} />, label: 'Disaster Alerts', sub: 'IMD · NDMA · Demo' },
  { icon: <Brain size={16} />, label: 'AI Interpretation', sub: 'AkashVani AI' },
];

export default function TrustStrip() {
  return (
    <section className="bg-card border-y border-border py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {STRIPS?.map((item, i) => (
            <motion.div
              key={item?.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="flex items-center gap-2.5 min-w-0"
            >
              <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 text-primary">
                {item?.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground leading-none">{item?.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{item?.sub}</p>
              </div>
            </motion.div>
          ))}
          <div className="demo-badge text-[10px] font-semibold px-2 py-1 rounded-full flex-shrink-0">
            LIVE DATA
          </div>
        </div>
      </div>
    </section>
  );
}
