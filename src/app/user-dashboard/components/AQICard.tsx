'use client';

import React from 'react';
import { Wind, AlertCircle, TrendingUp } from 'lucide-react';
import { DEMO_AQI } from '@/lib/mockData';

const AQI_LEVELS = [
  { max: 50, label: 'Good', color: 'text-success', bg: 'bg-success/10 border-success/20' },
  { max: 100, label: 'Satisfactory', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  { max: 200, label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
  { max: 300, label: 'Poor', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
  { max: 400, label: 'Very Poor', color: 'text-danger', bg: 'bg-danger/10 border-danger/20' },
  { max: 500, label: 'Severe', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
];

function getAQILevel(value: number) {
  return AQI_LEVELS.find((l) => value <= l.max) || AQI_LEVELS[AQI_LEVELS.length - 1];
}

export default function AQICard() {
  const aqi = DEMO_AQI;
  const level = getAQILevel(aqi.value);

  return (
    <div className={`bg-card border rounded-2xl p-5 shadow-card h-full flex flex-col ${level.bg}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
            <Wind size={16} className="text-orange-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Air Quality</p>
            <p className="text-xs text-muted-foreground mt-0.5">Kolkata</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-muted-foreground bg-card px-2 py-0.5 rounded-full border border-border">OBSERVED</span>
      </div>

      {/* AQI value */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className={`text-metric-xl font-bold tabular-nums ${level.color}`}>{aqi.value}</span>
        <span className={`text-sm font-bold ${level.color}`}>{level.label}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">Primary: <span className="font-semibold text-foreground">{aqi.primaryPollutant}</span> · {aqi.pm25} µg/m³</p>

      {/* Pollutant breakdown */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: 'PM2.5', value: aqi.pm25, unit: 'µg' },
          { label: 'PM10', value: aqi.pm10, unit: 'µg' },
          { label: 'NO₂', value: aqi.no2, unit: 'ppb' },
          { label: 'O₃', value: aqi.o3, unit: 'ppb' },
          { label: 'CO', value: aqi.co, unit: 'mg' },
          { label: 'SO₂', value: aqi.so2, unit: 'ppb' },
        ].map((p) => (
          <div key={`poll-${p.label}`} className="bg-white/70 rounded-lg px-2 py-1.5 text-center">
            <p className="text-[10px] text-muted-foreground font-medium">{p.label}</p>
            <p className="text-xs font-bold text-foreground font-mono-data">{p.value}</p>
          </div>
        ))}
      </div>

      {/* Health advice */}
      <div className="flex items-start gap-2 bg-white/60 rounded-xl p-3 mt-auto">
        <AlertCircle size={14} className="text-orange-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">{aqi.recommendation}</p>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <TrendingUp size={10} className="text-danger" />
        <span>AQI trending up · {aqi.source}</span>
      </div>
    </div>
  );
}