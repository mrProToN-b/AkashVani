'use client';

import React from 'react';
import {
  Droplets, Wind, Eye, Gauge, Thermometer, Sun, Sunrise, Sunset, Cloud
} from 'lucide-react';
import { DEMO_WEATHER } from '@/lib/mockData';

function WeatherStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground flex-shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide leading-none">{label}</p>
        <p className="text-xs font-semibold text-foreground font-mono-data mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function CurrentWeatherCard() {
  const w = DEMO_WEATHER;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-card h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Current Weather</p>
          <p className="text-xs text-muted-foreground mt-0.5">{w.location} · {w.state}</p>
        </div>
        <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full border border-success/20">LIVE</span>
      </div>

      {/* Main temp display */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center">
          <Cloud size={28} className="text-primary" />
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-metric-xl text-foreground tabular-nums">{w.temp}°</span>
            <span className="text-sm text-muted-foreground font-medium">C</span>
          </div>
          <p className="text-sm text-muted-foreground">{w.condition}</p>
          <p className="text-xs text-muted-foreground">Feels like <span className="font-semibold text-orange-500">{w.feelsLike}°C</span></p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 flex-1">
        <WeatherStat icon={<Droplets size={14} />} label="Humidity" value={`${w.humidity}%`} />
        <WeatherStat icon={<Wind size={14} />} label="Wind" value={`${w.windSpeed} km/h ${w.windDir}`} />
        <WeatherStat icon={<Eye size={14} />} label="Visibility" value={`${w.visibility} km`} />
        <WeatherStat icon={<Gauge size={14} />} label="Pressure" value={`${w.pressure} hPa`} />
        <WeatherStat icon={<Sun size={14} />} label="UV Index" value={`${w.uvIndex} · High`} />
        <WeatherStat icon={<Thermometer size={14} />} label="Dew Point" value={`${w.dewPoint}°C`} />
        <WeatherStat icon={<Sunrise size={14} />} label="Sunrise" value={w.sunrise} />
        <WeatherStat icon={<Sunset size={14} />} label="Sunset" value={w.sunset} />
      </div>

      <div className="mt-3 pt-3 border-t border-border/60">
        <p className="text-[10px] text-muted-foreground">
          Source: <span className="font-medium">{w.source}</span> · 17:45 IST
        </p>
      </div>
    </div>
  );
}