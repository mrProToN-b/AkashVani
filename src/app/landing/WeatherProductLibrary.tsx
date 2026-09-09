'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  Wind,
  Satellite,
  Radar,
  TriangleAlert,
  ArrowRight,
} from 'lucide-react';

const PRODUCTS = [
  {
    icon: <Droplets size={16} />,
    title: 'Rainfall Forecast',
    model: 'WRF',
    updated: '3h ago',
    range: '72h',
    tag: 'FORECAST',
    tagColor: 'text-primary bg-primary/8 border-primary/20',
  },
  {
    icon: <Wind size={16} />,
    title: 'Wind Forecast',
    model: 'GFS',
    updated: '6h ago',
    range: '120h',
    tag: 'FORECAST',
    tagColor: 'text-primary bg-primary/8 border-primary/20',
  },
  {
    icon: <Satellite size={16} />,
    title: 'Satellite Observation',
    model: 'INSAT-3D',
    updated: 'Latest Frame',
    range: 'Real-time',
    tag: 'DEMO',
    tagColor: 'demo-badge',
  },
  {
    icon: <Radar size={16} />,
    title: 'Radar Observation',
    model: 'Doppler',
    updated: 'Precipitation',
    range: 'Real-time',
    tag: 'DEMO',
    tagColor: 'demo-badge',
  },
  {
    icon: <TriangleAlert size={16} />,
    title: 'Cyclone Track',
    model: 'IMD',
    updated: 'Severe Weather',
    range: '5-day track',
    tag: 'OFFICIAL',
    tagColor: 'official-badge',
  },
];

export default function WeatherProductLibrary() {
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
            One platform. Multiple layers of weather intelligence.
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
            A scientific data catalogue of weather products, observations and forecasts.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {PRODUCTS?.map((p, i) => (
            <motion.div
              key={p?.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="bg-card border border-border rounded-xl p-4 hover:shadow-card transition-shadow group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-primary">
                  {p?.icon}
                </div>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${p?.tagColor}`}>
                  {p?.tag}
                </span>
              </div>
              <h3 className="text-xs font-semibold text-foreground mb-2 leading-snug">{p?.title}</h3>
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Model</span>
                  <span className="text-[10px] font-mono text-foreground">{p?.model}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Updated</span>
                  <span className="text-[10px] font-mono text-foreground">{p?.updated}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Range</span>
                  <span className="text-[10px] font-mono text-foreground">{p?.range}</span>
                </div>
              </div>
              <button className="w-full text-[10px] font-semibold text-primary flex items-center justify-center gap-1 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/5 transition-colors opacity-0 group-hover:opacity-100">
                View Product <ArrowRight size={10} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
