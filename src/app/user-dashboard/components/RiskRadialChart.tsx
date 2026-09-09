'use client';

import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface Props {
  score: number;
  color: string;
}

const COLOR_MAP: Record<string, string> = {
  low: '#10B981',
  moderate: '#F59E0B',
  high: '#F97316',
  critical: '#EF4444',
  extreme: '#7C3AED',
};

export default function RiskRadialChart({ score, color }: Props) {
  const fillColor = COLOR_MAP[color] || '#64748B';
  const data = [{ name: 'Risk', value: score, fill: fillColor }];

  return (
    <div className="w-28 h-28 relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
          barSize={10}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: 'var(--secondary)' }}
            dataKey="value"
            angleAxisId={0}
            cornerRadius={6}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tabular-nums" style={{ color: fillColor }}>{score}</span>
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Risk</span>
      </div>
    </div>
  );
}