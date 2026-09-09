'use client';

import React, { useState } from 'react';
import { AlertTriangle, X, ChevronRight, Bell } from 'lucide-react';
import { DEMO_ALERTS } from '@/lib/mockData';

export default function AlertBanner() {
  const [dismissed, setDismissed] = useState(false);
  const activeAlert = DEMO_ALERTS?.[0];

  if (dismissed) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3 animate-slide-up">
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-8 h-8 rounded-full bg-warning/15 flex items-center justify-center pulse-ring">
          <AlertTriangle size={16} className="text-warning" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wide bg-warning/20 px-2 py-0.5 rounded-full">
            {activeAlert?.type}
          </span>
          <span className="text-xs font-semibold text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 bg-white">
            {activeAlert?.severity}
          </span>
          <span className="demo-badge text-xs font-semibold px-2 py-0.5 rounded-full">
            LIVE ALERT 
          </span>
        </div>
        <p className="text-sm font-semibold text-amber-900 mt-1">{activeAlert?.title}</p>
        <p className="text-xs text-amber-700 mt-0.5 line-clamp-2">{activeAlert?.message}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-amber-600">
            {activeAlert?.agencyCode} · Valid until 23:00 IST
          </span>
          <button className="text-xs font-semibold text-primary flex items-center gap-0.5 hover:underline">
            View full alert <ChevronRight size={12} />
          </button>
          <button className="text-xs font-semibold text-amber-700 flex items-center gap-1">
            <Bell size={12} /> Set reminder
          </button>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-amber-100 transition-colors text-amber-600"
      >
        <X size={16} />
      </button>
    </div>
  );
}