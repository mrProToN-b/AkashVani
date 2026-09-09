'use client';

import React from 'react';
import Link from 'next/link';
import { CloudSun, TriangleAlert } from 'lucide-react';

const FOOTER_LINKS = [
  {
    title: 'Platform',
    links: [
      { label: 'Weather', href: '#hero' },
      { label: 'Live Map', href: '#live-map' },
      { label: 'Disaster Intelligence', href: '#disaster' },
      { label: 'AI Assistant', href: '#ask-akashvani' },
      { label: 'Data Sources', href: '#data-trust' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Safety', href: '#' },
      { label: 'Accessibility', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  },
  {
    title: 'System',
    links: [
      { label: 'Demo Data', href: '#' },
      { label: 'API Status', href: '#' },
      { label: 'Version 0.1.0', href: '#' },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer className="bg-card border-t border-border">
      {/* Emergency disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-start gap-2">
          <TriangleAlert size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-800 leading-relaxed">
            <strong>Emergency Disclaimer:</strong> AkashVani is a demonstration platform. All data shown is simulated live data. During real emergencies, always follow instructions from official government agencies (IMD, NDMA, State Disaster Management Authorities). 
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <CloudSun size={15} className="text-white" />
              </div>
              <span className="font-bold text-sm text-foreground">AKASHVANI</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Weather that understands you.
            </p>
            <p className="text-[10px] text-muted-foreground/70">
              From weather data to weather decisions.
            </p>
          </div>

          {/* Links */}
          {FOOTER_LINKS?.map((section) => (
            <div key={section?.title}>
              <p className="text-[10px] font-semibold text-foreground uppercase tracking-widest mb-3">{section?.title}</p>
              <ul className="space-y-2">
                {section?.links?.map((link) => (
                  <li key={link?.label}>
                    <a
                      href={link?.href}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link?.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground">
            © 2026 AkashVani. All data is demonstration only.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <Link href="/login" className="text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors">
              Get Started →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
