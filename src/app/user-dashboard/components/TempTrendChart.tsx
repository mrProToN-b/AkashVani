'use client';

import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { DEMO_TEMP_TREND } from '@/lib/mockData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-elevated text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={`tt-tip-${i}`} style={{ color: p.color }} className="font-mono-data">
          {p.name}: {p.value}°C
        </p>
      ))}
    </div>
  );
};

export default function TempTrendChart() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Temperature Trend</p>
          <p className="text-xs text-muted-foreground mt-0.5">Today · Kolkata · °C</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">OBSERVED + FORECAST</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={DEMO_TEMP_TREND} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="feelsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="var(--danger)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8, color: 'var(--muted-foreground)' }} />
          <Area type="monotone" dataKey="temp" name="Actual Temp" stroke="var(--primary)" fill="url(#tempGrad)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: 'var(--primary)' }} />
          <Area type="monotone" dataKey="feelsLike" name="Feels Like" stroke="var(--danger)" fill="url(#feelsGrad)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: 'var(--danger)' }} strokeDasharray="4 2" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}