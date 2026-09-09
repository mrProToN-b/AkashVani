'use client';

import React from 'react';
import type { MapLayer } from './MapPageContent';

const TEMP_LEGEND = [
  { color: '#DC2626', label: '≥40°C — Extreme Heat' },
  { color: '#EA580C', label: '36–39°C — Very Hot' },
  { color: '#F59E0B', label: '32–35°C — Hot' },
  { color: '#84CC16', label: '28–31°C — Warm' },
  { color: '#22D3EE', label: '24–27°C — Pleasant' },
  { color: '#3B82F6', label: '<24°C — Cool' },
];

const RAIN_LEGEND = [
  { color: '#1E3A8A', label: '>100mm — Extremely Heavy' },
  { color: '#1D4ED8', label: '64–100mm — Very Heavy' },
  { color: '#3B82F6', label: '35–64mm — Heavy' },
  { color: '#60A5FA', label: '15–35mm — Moderate' },
  { color: '#93C5FD', label: '2–15mm — Light' },
  { color: '#DBEAFE', label: '<2mm — Trace' },
];

const AQI_LEGEND = [
  { color: '#10B981', label: '0–50 — Good' },
  { color: '#84CC16', label: '51–100 — Satisfactory' },
  { color: '#F59E0B', label: '101–200 — Moderate' },
  { color: '#F97316', label: '201–300 — Poor' },
  { color: '#EF4444', label: '301–400 — Very Poor' },
  { color: '#7C3AED', label: '401–500 — Severe' },
];

const LAYER_LEGEND_MAP: Record<string, typeof TEMP_LEGEND> = {
  'layer-temp': TEMP_LEGEND,
  'layer-rain': RAIN_LEGEND,
  'layer-aqi': AQI_LEGEND,
};

interface Props {
  activeLayer: MapLayer;
}

export default function MapLegend({ activeLayer }: Props) {
  const legendData = LAYER_LEGEND_MAP[activeLayer.id] || TEMP_LEGEND;

  return (
    <div className="map-panel border border-border rounded-xl shadow-elevated p-3 mb-2">
      <p className="text-xs font-semibold text-foreground mb-2">{activeLayer.label}</p>
      <div className="space-y-1.5">
        {legendData.map((item, i) => (
          <div key={`legend-item-${i}`} className="flex items-center gap-2">
            <span className="w-4 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t border-border/60">
        LIVE DATA 
      </p>
    </div>
  );
}