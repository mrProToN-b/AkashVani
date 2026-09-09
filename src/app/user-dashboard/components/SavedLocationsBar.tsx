'use client';

import React from 'react';
import { MapPin, Home, Briefcase, Heart, Plus, AlertTriangle } from 'lucide-react';
import { DEMO_SAVED_LOCATIONS } from '@/lib/mockData';

const LABEL_ICONS: Record<string, React.ReactNode> = {
  Home: <Home size={12} />,
  Office: <Briefcase size={12} />,
  Family: <Heart size={12} />,
};

function getRiskColor(risk: number) {
  if (risk >= 70) return 'text-danger';
  if (risk >= 50) return 'text-warning';
  if (risk >= 30) return 'text-orange-500';
  return 'text-success';
}

interface Props {
  activeLocation: string;
  onLocationChange: (id: string) => void;
}

export default function SavedLocationsBar({ activeLocation, onLocationChange }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
      {DEMO_SAVED_LOCATIONS.map((loc) => (
        <button
          key={loc.id}
          onClick={() => onLocationChange(loc.id)}
          className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-150 ${
            activeLocation === loc.id
              ? 'bg-primary text-primary-foreground border-primary shadow-card'
              : 'bg-card text-foreground border-border hover:bg-secondary hover:border-primary/30'
          }`}
        >
          <span className={activeLocation === loc.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}>
            {LABEL_ICONS[loc.label] || <MapPin size={12} />}
          </span>
          <span className="font-semibold">{loc.label}</span>
          <span className={`text-xs font-mono-data ${activeLocation === loc.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
            {loc.temp}°
          </span>
          {loc.alertCount > 0 && (
            <span className={`flex items-center gap-0.5 text-xs font-bold ${
              activeLocation === loc.id ? 'text-amber-200' : 'text-warning'
            }`}>
              <AlertTriangle size={10} />
              {loc.alertCount}
            </span>
          )}
        </button>
      ))}
      <button className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-border text-xs font-semibold text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all">
        <Plus size={14} /> Add Location
      </button>
    </div>
  );
}