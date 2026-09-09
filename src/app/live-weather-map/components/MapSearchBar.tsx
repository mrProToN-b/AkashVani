'use client';

import React, { useState } from 'react';
import { Search, Navigation, Layers, X } from 'lucide-react';
import { DEMO_LOCATIONS } from '@/lib/mockData';
import type { SelectedMapLocation } from './MapPageContent';

interface Props {
  onLocationSelect: (loc: SelectedMapLocation) => void;
  layerPanelOpen: boolean;
  setLayerPanelOpen: (open: boolean) => void;
}

export default function MapSearchBar({ onLocationSelect, layerPanelOpen, setLayerPanelOpen }: Props) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filtered = query.length > 1
    ? DEMO_LOCATIONS.filter((l) =>
        l.name.toLowerCase().includes(query.toLowerCase()) ||
        l.state.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (loc: typeof DEMO_LOCATIONS[0]) => {
    onLocationSelect({ lat: loc.lat, lng: loc.lng, name: `${loc.name}, ${loc.state}` });
    setQuery(loc.name);
    setShowResults(false);
  };

  return (
    <div className="flex items-start gap-2 w-full">
      {/* Search input */}
      <div className="relative flex-1 max-w-sm">
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl shadow-elevated px-3 py-2.5">
          <Search size={16} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
            onFocus={() => setShowResults(true)}
            placeholder="Search city or location..."
            className="flex-1 text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(''); setShowResults(false); }} className="text-muted-foreground hover:text-foreground">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search results dropdown */}
        {showResults && filtered.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-card border border-border rounded-xl shadow-elevated overflow-hidden z-10">
            {filtered.map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleSelect(loc)}
                className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-secondary transition-colors text-left"
              >
                <Navigation size={14} className="text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{loc.name}</p>
                  <p className="text-xs text-muted-foreground">{loc.state}</p>
                </div>
                <span className="ml-auto text-[10px] font-mono-data text-muted-foreground">
                  {loc.lat.toFixed(2)}°N
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* GPS button */}
      <button
        onClick={() => onLocationSelect({ lat: 28.6139, lng: 77.209, name: 'Kolkata (GPS)' })}
        className="bg-card border border-border rounded-xl p-2.5 shadow-elevated hover:bg-secondary transition-colors"
        title="Use my location"
      >
        <Navigation size={18} className="text-primary" />
      </button>

      {/* Layer toggle button */}
      <button
        onClick={() => setLayerPanelOpen(!layerPanelOpen)}
        className={`border rounded-xl p-2.5 shadow-elevated transition-colors ${
          layerPanelOpen ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-muted-foreground hover:bg-secondary'
        }`}
        title="Toggle layer panel"
      >
        <Layers size={18} />
      </button>
    </div>
  );
}