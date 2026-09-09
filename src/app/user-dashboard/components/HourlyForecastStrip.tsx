'use client';

import React from 'react';
import { Droplets, Wind, Cloud, CloudRain, Zap, Moon, Sun } from 'lucide-react';
import { DEMO_HOURLY_FORECAST } from '@/lib/mockData';

const ICON_MAP: Record<string, React.ReactNode> = {
  'cloud-sun': <Sun size={18} className="text-yellow-500" />,
  'storm': <Zap size={18} className="text-warning" />,
  'rain-heavy': <CloudRain size={18} className="text-blue-500" />,
  'rain': <CloudRain size={18} className="text-blue-400" />,
  'cloud': <Cloud size={18} className="text-muted-foreground" />,
  'cloud-moon': <Moon size={18} className="text-slate-400" />,
  'moon': <Moon size={18} className="text-slate-500" />,
};

function getRainColor(prob: number) {
  if (prob >= 70) return 'bg-blue-500';
  if (prob >= 40) return 'bg-blue-400';
  if (prob >= 20) return 'bg-blue-300';
  return 'bg-blue-200';
}

export default function HourlyForecastStrip() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Hourly Forecast</p>
          <p className="text-xs text-muted-foreground mt-0.5">Next 12 hours · Kolkata</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">FORECAST</span>
          <button className="text-xs text-primary font-semibold hover:underline">7-Day →</button>
        </div>
      </div>

      {/* Scroll strip */}
      <div className="forecast-scroll flex gap-2 pb-2 flex-1">
        {DEMO_HOURLY_FORECAST.map((hour) => (
          <div
            key={hour.id}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 bg-secondary/50 hover:bg-secondary rounded-xl px-3 py-2.5 cursor-pointer transition-colors min-w-[68px]"
          >
            <span className="text-xs font-semibold text-muted-foreground font-mono-data">{hour.time}</span>
            <div className="w-9 h-9 flex items-center justify-center">
              {ICON_MAP[hour.icon] || <Cloud size={18} className="text-muted-foreground" />}
            </div>
            <span className="text-sm font-bold text-foreground tabular-nums">{hour.temp}°</span>
            <div className="w-full">
              <div className="flex items-center justify-center gap-0.5 mb-1">
                <Droplets size={10} className="text-blue-400" />
                <span className="text-[10px] font-semibold text-blue-500 tabular-nums">{hour.rainProb}%</span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-1">
                <div className={`h-1 rounded-full transition-all ${getRainColor(hour.rainProb)}`} style={{ width: `${hour.rainProb}%` }} />
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <Wind size={10} className="text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground tabular-nums">{hour.windSpeed}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-border/60 flex items-center gap-4 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><Droplets size={10} className="text-blue-400" /> Rain probability</span>
        <span className="flex items-center gap-1"><Wind size={10} /> Wind km/h</span>
        <span className="ml-auto">Source: IMD / GFS Model · LIVE DATA</span>
      </div>
    </div>
  );
}