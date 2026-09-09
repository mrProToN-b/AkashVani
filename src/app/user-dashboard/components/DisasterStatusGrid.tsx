'use client';

import React from 'react';
import { Wind, Droplets, Activity, Mountain, Thermometer, Zap, AlertTriangle, Eye } from 'lucide-react';
import { DEMO_DISASTERS } from '@/lib/mockData';

const ICON_MAP: Record<string, React.ReactNode> = {
  wind: <Wind size={18} />,
  droplets: <Droplets size={18} />,
  activity: <Activity size={18} />,
  mountain: <Mountain size={18} />,
  thermometer: <Thermometer size={18} />,
  zap: <Zap size={18} />,
};

const STATUS_CONFIG: Record<string, { color: string; bg: string; dot: string }> = {
  Warning: { color: 'text-warning', bg: 'bg-warning/10 border-warning/30', dot: 'bg-warning' },
  Alert: { color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', dot: 'bg-orange-500' },
  Active: { color: 'text-danger', bg: 'bg-danger/10 border-danger/30', dot: 'bg-danger' },
  Watch: { color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
  None: { color: 'text-success', bg: 'bg-success/10 border-success/20', dot: 'bg-success' },
};

const SEVERITY_COLOR: Record<string, string> = {
  HIGH: 'text-danger bg-danger/10',
  MODERATE: 'text-warning bg-warning/10',
  LOW: 'text-success bg-success/10',
};

export default function DisasterStatusGrid() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Disaster Intelligence</p>
          <p className="text-xs text-muted-foreground mt-0.5">India-wide · Updated 17:50 IST</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="demo-badge text-xs font-semibold px-2.5 py-1 rounded-full">LIVE DATA</span>
          <button className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
            <Eye size={12} /> Full Intel Center
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {DEMO_DISASTERS.map((disaster) => {
          const status = STATUS_CONFIG[disaster.status] || STATUS_CONFIG.None;
          return (
            <div
              key={disaster.id}
              className={`border rounded-xl p-3 cursor-pointer hover:shadow-elevated transition-all duration-200 ${status.bg}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  disaster.status === 'Active' ? 'bg-danger/15 text-danger' :
                  disaster.status === 'Warning' ? 'bg-warning/15 text-warning' :
                  disaster.status === 'Alert' ? 'bg-orange-100 text-orange-600' :
                  disaster.status === 'Watch'? 'bg-blue-100 text-blue-600' : 'bg-success/10 text-success'
                }`}>
                  {ICON_MAP[disaster.icon] || <AlertTriangle size={18} />}
                </div>
                <div className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${disaster.status !== 'None' ? 'animate-pulse' : ''}`} />
                </div>
              </div>
              <p className="text-xs font-bold text-foreground">{disaster.type}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${status.color} bg-white/60`}>
                  {disaster.status}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 leading-tight line-clamp-2">{disaster.detail}</p>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium truncate">{disaster.region}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-border/60 flex items-center gap-4 text-[10px] text-muted-foreground flex-wrap">
        {['Active', 'Warning', 'Alert', 'Watch', 'None'].map((s) => (
          <span key={`legend-${s}`} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[s]?.dot}`} />
            {s}
          </span>
        ))}
        <span className="ml-auto">Sources: IMD · NDMA · CWC · INCOIS</span>
      </div>
    </div>
  );
}