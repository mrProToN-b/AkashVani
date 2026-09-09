'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Layers } from 'lucide-react';
import type { MapLayer } from './MapPageContent';

const GROUP_ORDER = ['Weather', 'Observation', 'Disaster', 'Environment', 'Geography'];

const GROUP_COLORS: Record<string, string> = {
  Weather: 'text-blue-600',
  Observation: 'text-purple-600',
  Disaster: 'text-danger',
  Environment: 'text-green-600',
  Geography: 'text-muted-foreground',
};

interface Props {
  layers: MapLayer[];
  onToggle: (id: string) => void;
}

export default function MapLayerPanel({ layers, onToggle }: Props) {
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    Observation: true,
    Environment: true,
    Geography: false,
  });

  const toggleGroup = (group: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const grouped = GROUP_ORDER.map((group) => ({
    group,
    items: layers.filter((l) => l.group === group),
  }));

  return (
    <div className="map-panel border border-border rounded-2xl shadow-elevated overflow-hidden">
      <div className="px-3 py-2.5 border-b border-border flex items-center gap-2">
        <Layers size={15} className="text-primary" />
        <span className="text-sm font-semibold text-foreground">Map Layers</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {layers.filter((l) => l.active).length} active
        </span>
      </div>

      <div className="max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-hide">
        {grouped.map(({ group, items }) => (
          <div key={`group-${group}`} className="border-b border-border/50 last:border-0">
            <button
              onClick={() => toggleGroup(group)}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-secondary/50 transition-colors"
            >
              <span className={`text-xs font-bold uppercase tracking-wide ${GROUP_COLORS[group]}`}>
                {group}
              </span>
              <span className="ml-auto text-muted-foreground">
                {collapsedGroups[group] ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
              </span>
            </button>

            {!collapsedGroups[group] && (
              <div className="pb-1">
                {items.map((layer) => (
                  <label
                    key={layer.id}
                    className="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer hover:bg-secondary/40 transition-colors"
                  >
                    <div
                      onClick={() => onToggle(layer.id)}
                      className={`w-9 h-5 rounded-full relative transition-all duration-200 cursor-pointer flex-shrink-0 ${
                        layer.active ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${
                          layer.active ? 'left-4' : 'left-0.5'
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${layer.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {layer.label}
                    </span>
                    {layer.active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}