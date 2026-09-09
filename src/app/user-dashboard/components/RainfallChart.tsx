'use client';

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { DEMO_HOURLY_FORECAST } from '@/lib/mockData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-elevated text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className="text-blue-500 font-mono-data">Rain prob: {payload[0]?.value}%</p>
      {payload[1] && <p className="text-blue-400 font-mono-data">Rainfall: {payload[1].value} mm</p>}
    </div>
  );
};

function getBarColor(prob: number) {
  if (prob >= 70) return '#3B82F6';
  if (prob >= 40)return '#60A5FA';
  if (prob >= 20) return '#93C5FD';
  return '#BFDBFE';
}

export default function RainfallChart() {
  const data = DEMO_HOURLY_FORECAST.map((h) => ({
    id: h.id,
    time: h.time,
    rainProb: h.rainProb,
    rain: h.rain,
  }));

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Rainfall Probability</p>
          <p className="text-xs text-muted-foreground mt-0.5">Next 12 hours · Kolkata · %</p>
        </div>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">FORECAST</span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="rainProb" name="Rain Probability" radius={[4, 4, 0, 0]} maxBarSize={32}>
            {data.map((entry) => (
              <Cell key={entry.id} fill={getBarColor(entry.rainProb)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-3 pt-3 border-t border-border/60 flex items-center gap-4 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm bg-blue-500 inline-block" /> High ≥70%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm bg-blue-300 inline-block" /> Moderate 40–70%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm bg-blue-200 inline-block" /> Low &lt;40%
        </span>
        <span className="ml-auto">Source: GFS / IMD NWP · LIVE DATA</span>
      </div>
    </div>
  );
}