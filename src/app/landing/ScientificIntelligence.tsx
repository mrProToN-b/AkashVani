'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CloudSun,
  Activity,
  Radar,
  Satellite,
  TriangleAlert,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

const CARDS = [
  {
    icon: <CloudSun size={18} />,
    title: 'Forecast Models',
    desc: 'Multi-model NWP forecasts from IMD, GFS, WRF and ECMWF with ensemble agreement.',
    meta: 'IMD · GFS · WRF · ECMWF',
    range: '7-day forecast',
  },
  {
    icon: <Activity size={18} />,
    title: 'Weather Observations',
    desc: 'Surface synoptic, AWS, radiosonde and upper-air observations across India.',
    meta: 'IMD Network · Demo',
    range: 'Real-time',
  },
  {
    icon: <Radar size={18} />,
    title: 'Radar & Satellite',
    desc: 'Doppler radar precipitation and INSAT-3D satellite imagery for nowcasting.',
    meta: 'Doppler · INSAT-3D',
    range: '10-min updates',
  },
  {
    icon: <TrendingUp size={18} />,
    title: 'Ensemble Prediction',
    desc: 'Probabilistic forecasts showing model spread and forecast confidence levels.',
    meta: 'EPS · GEFS · Demo',
    range: '15-day outlook',
  },
  {
    icon: <TriangleAlert size={18} />,
    title: 'Severe Weather',
    desc: 'Cyclone, thunderstorm, heavy rainfall and extreme weather monitoring.',
    meta: 'IMD · NDMA · Demo',
    range: 'Active monitoring',
  },
  {
    icon: <Satellite size={18} />,
    title: 'Climate Trends',
    desc: 'Historical climate analysis, anomaly detection and long-term trend visualization.',
    meta: 'ERA5 · IMD · Demo',
    range: '30-year baseline',
  },
];

export default function ScientificIntelligence() {
  return (
    <section className="py-16 lg:py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Built on scientific weather intelligence.
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
            Professional-grade meteorological products, accessible to everyone.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CARDS?.map((card, i) => (
            <motion.div
              key={card?.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-card transition-shadow group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary">
                  {card?.icon}
                </div>
                <button className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight size={10} />
                </button>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{card?.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{card?.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-foreground/70">{card?.meta}</span>
                <span className="text-[10px] font-mono text-primary/70">{card?.range}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
