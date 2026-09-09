'use client';

import React from 'react';
import { Play, Pause, SkipBack } from 'lucide-react';

const TIMELINE_STEPS = [
  { id: 'tl-now', label: 'NOW', offset: 0 },
  { id: 'tl-1h', label: '+1H', offset: 1 },
  { id: 'tl-3h', label: '+3H', offset: 3 },
  { id: 'tl-6h', label: '+6H', offset: 6 },
  { id: 'tl-12h', label: '+12H', offset: 12 },
  { id: 'tl-tmr', label: 'TMR', offset: 24 },
  { id: 'tl-2d', label: '+2D', offset: 48 },
  { id: 'tl-3d', label: '+3D', offset: 72 },
  { id: 'tl-5d', label: '+5D', offset: 120 },
  { id: 'tl-7d', label: '+7D', offset: 168 },
];

interface Props {
  timelineIndex: number;
  onTimelineChange: (index: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export default function MapTimelineBar({ timelineIndex, onTimelineChange, isPlaying, onPlayPause }: Props) {
  const currentStep = TIMELINE_STEPS[timelineIndex];

  return (
    <div className="bg-card border-t border-border px-4 py-3 flex-shrink-0 z-10">
      <div className="max-w-screen-2xl mx-auto flex items-center gap-3">
        {/* Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onTimelineChange(0)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            title="Reset to Now"
          >
            <SkipBack size={16} />
          </button>
          <button
            onClick={onPlayPause}
            className={`p-2 rounded-lg transition-colors ${
              isPlaying ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
            }`}
            title={isPlaying ? 'Pause' : 'Play animation'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>

        {/* Timeline steps */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {TIMELINE_STEPS.map((step, i) => (
            <button
              key={step.id}
              onClick={() => onTimelineChange(i)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                timelineIndex === i
                  ? 'bg-primary text-primary-foreground shadow-card'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              } ${step.label === 'NOW' ? 'font-bold' : ''}`}
            >
              {step.label}
            </button>
          ))}
        </div>

        {/* Current timestamp */}
        <div className="flex-shrink-0 text-right hidden sm:block">
          <p className="text-xs font-mono-data font-semibold text-foreground">
            {currentStep.label === 'NOW' ? '08 Sep 2026 · 17:56 IST' : `+${currentStep.offset}h forecast`}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {isPlaying ? '▶ Playing animation...' : 'Tap to step · Play to animate'}
          </p>
        </div>
      </div>
    </div>
  );
}