'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { TrendingUp, Info, ChevronDown, ChevronUp, Minus } from 'lucide-react';
import { DEMO_RISK } from '@/lib/mockData';

const RiskRadialChart = dynamic(() => import('./RiskRadialChart'), { ssr: false });

const RISK_COLORS: Record<string, string> = {
  low: 'text-success',
  moderate: 'text-warning',
  high: 'text-orange-500',
  critical: 'text-danger',
  extreme: 'text-purple-600',
};

const RISK_BG: Record<string, string> = {
  low: 'bg-success/10 border-success/20',
  moderate: 'bg-warning/10 border-warning/20',
  high: 'bg-orange-50 border-orange-200',
  critical: 'bg-danger/10 border-danger/20',
  extreme: 'bg-purple-50 border-purple-200',
};

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'up') return <ChevronUp size={12} className="text-danger" />;
  if (trend === 'down') return <ChevronDown size={12} className="text-success" />;
  return <Minus size={12} className="text-muted-foreground" />;
}

export default function RiskScoreCard() {
  const risk = DEMO_RISK;
  const colorClass = RISK_COLORS[risk.color] || 'text-foreground';
  const bgClass = RISK_BG[risk.color] || 'bg-secondary';

  return (
    <div className={`bg-card border rounded-2xl p-5 shadow-card h-full ${bgClass}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Overall Risk Score</p>
          <p className="text-xs text-muted-foreground mt-0.5">Agarpara, Kolkata · Updated 5 min ago</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">OBSERVED</span>
          <button className="p-1.5 rounded-lg hover:bg-secondary/70 transition-colors">
            <Info size={14} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Radial chart */}
        <div className="flex-shrink-0">
          <RiskRadialChart score={risk.overall} color={risk.color} />
        </div>

        {/* Score details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className={`text-metric-xl font-bold tabular-nums ${colorClass}`}>{risk.overall}</span>
            <span className="text-lg text-muted-foreground">/100</span>
            <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${
              risk.color === 'high' ? 'bg-orange-100 text-orange-700' :
              risk.color === 'critical' ? 'bg-danger/15 text-danger' :
              risk.color === 'moderate'? 'bg-warning/15 text-amber-700' : 'bg-success/15 text-success'
            }`}>
              {risk.label} Risk
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
            {risk.explanation}
          </p>

          {/* Risk breakdown bars */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {risk.breakdown.slice(0, 6).map((item) => (
              <div key={item.id} className="flex items-center gap-1.5">
                <TrendIcon trend={item.trend} />
                <span className="text-xs text-muted-foreground w-14 truncate">{item.category}</span>
                <div className="flex-1 bg-secondary rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.score >= 70 ? 'bg-danger' :
                      item.score >= 50 ? 'bg-warning' :
                      item.score >= 30 ? 'bg-info': 'bg-success'
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <span className="text-xs font-mono-data font-semibold w-6 text-right">{item.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <TrendingUp size={12} className="text-danger" />
          <span>Risk trending up — Lightning & Rain elevated</span>
        </div>
        <button className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
          Why is my score high?
        </button>
      </div>
    </div>
  );
}