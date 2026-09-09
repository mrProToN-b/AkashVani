'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import MapLayerPanel from './MapLayerPanel';
import MapTimelineBar from './MapTimelineBar';
import MapSearchBar from './MapSearchBar';
import MapLegend from './MapLegend';
import AskTheMapPanel from './AskTheMapPanel';

// Leaflet must be loaded client-side only
const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false });

export type MapLayer = {
  id: string;
  label: string;
  group: string;
  active: boolean;
  color?: string;
};

const INITIAL_LAYERS: MapLayer[] = [
  // Weather
  { id: 'layer-temp', label: 'Temperature', group: 'Weather', active: true },
  { id: 'layer-rain', label: 'Rainfall', group: 'Weather', active: false },
  { id: 'layer-wind', label: 'Wind Speed', group: 'Weather', active: false },
  { id: 'layer-pressure', label: 'Pressure', group: 'Weather', active: false },
  { id: 'layer-clouds', label: 'Cloud Cover', group: 'Weather', active: false },
  { id: 'layer-humidity', label: 'Humidity', group: 'Weather', active: false },
  // Observation
  { id: 'layer-radar', label: 'Radar', group: 'Observation', active: false },
  { id: 'layer-satellite', label: 'Satellite', group: 'Observation', active: false },
  { id: 'layer-lightning', label: 'Lightning', group: 'Observation', active: false },
  { id: 'layer-stations', label: 'Weather Stations', group: 'Observation', active: false },
  // Disaster
  { id: 'layer-cyclone', label: 'Cyclone Track', group: 'Disaster', active: false },
  { id: 'layer-flood', label: 'Flood Zones', group: 'Disaster', active: false },
  { id: 'layer-fire', label: 'Active Fires', group: 'Disaster', active: false },
  { id: 'layer-heatwave', label: 'Heatwave', group: 'Disaster', active: false },
  { id: 'layer-earthquake', label: 'Earthquakes', group: 'Disaster', active: false },
  // Environment
  { id: 'layer-aqi', label: 'AQI', group: 'Environment', active: false },
  { id: 'layer-smoke', label: 'Smoke / Aerosol', group: 'Environment', active: false },
  // Geography
  { id: 'layer-roads', label: 'Roads', group: 'Geography', active: false },
  { id: 'layer-rivers', label: 'Rivers', group: 'Geography', active: false },
  { id: 'layer-boundaries', label: 'State Boundaries', group: 'Geography', active: false },
  { id: 'layer-alerts-overlay', label: 'Alert Zones', group: 'Geography', active: true },
  { id: 'layer-shelters', label: 'Shelters', group: 'Geography', active: false },
];

export interface SelectedMapLocation {
  lat: number;
  lng: number;
  name: string;
}

export default function MapPageContent() {
  const [layers, setLayers] = useState<MapLayer[]>(INITIAL_LAYERS);
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SelectedMapLocation | null>(null);
  const [layerPanelOpen, setLayerPanelOpen] = useState(true);
  const [legendOpen, setLegendOpen] = useState(false);

  const toggleLayer = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, active: !l.active } : l))
    );
  };

  const activeLayerForLegend = layers.find((l) => l.active && l.group !== 'Geography');

  return (
    <div className="relative w-full flex flex-col" style={{ height: 'calc(100vh - 112px)' }}>
      {/* Demo data banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex items-center gap-2 flex-shrink-0 z-10">
        <span className="demo-badge text-xs font-semibold px-2 py-0.5 rounded-full">LIVE DATA</span>
        <span className="text-xs text-amber-700 font-medium">
          All map overlays are simulated for demonstration. Not real-time official data.
        </span>
      </div>

      {/* Map container */}
      <div className="flex-1 relative overflow-hidden">
        {/* Search bar — top */}
        <div className="absolute top-3 left-3 right-3 z-[1000] flex items-start gap-2">
          <MapSearchBar onLocationSelect={setSelectedLocation} layerPanelOpen={layerPanelOpen} setLayerPanelOpen={setLayerPanelOpen} />
        </div>

        {/* Layer panel — left side */}
        {layerPanelOpen && (
          <div className="absolute top-16 left-3 z-[1000] w-64">
            <MapLayerPanel layers={layers} onToggle={toggleLayer} />
          </div>
        )}

        {/* Ask the Map panel — right side */}
        {selectedLocation && (
          <div className="absolute top-16 right-3 z-[1000] w-72">
            <AskTheMapPanel location={selectedLocation} onClose={() => setSelectedLocation(null)} />
          </div>
        )}

        {/* Legend toggle */}
        <div className="absolute bottom-20 right-3 z-[1000]">
          <button
            onClick={() => setLegendOpen(!legendOpen)}
            className="bg-card border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground shadow-elevated hover:bg-secondary transition-colors flex items-center gap-1.5"
          >
            <span className="w-3 h-3 rounded-sm bg-primary/60 inline-block" />
            Legend
          </button>
          {legendOpen && activeLayerForLegend && (
            <div className="absolute bottom-10 right-0 w-48">
              <MapLegend activeLayer={activeLayerForLegend} />
            </div>
          )}
        </div>

        {/* Leaflet Map */}
        <LeafletMap
          layers={layers}
          timelineIndex={timelineIndex}
          onLocationClick={setSelectedLocation}
        />
      </div>

      {/* Timeline bar — bottom */}
      <MapTimelineBar
        timelineIndex={timelineIndex}
        onTimelineChange={setTimelineIndex}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
      />
    </div>
  );
}