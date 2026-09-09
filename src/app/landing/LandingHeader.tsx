'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CloudSun,
  Map,
  TriangleAlert,
  Bot,
  Database,
  Globe,
  Menu,
  X,
} from 'lucide-react';

const NAV_LINKS = [
  { label: 'Weather', href: '#hero', icon: <CloudSun size={15} /> },
  { label: 'Live Map', href: '#live-map', icon: <Map size={15} /> },
  { label: 'Disaster Intelligence', href: '#disaster', icon: <TriangleAlert size={15} /> },
  { label: 'AI Assistant', href: '#ask-akashvani', icon: <Bot size={15} /> },
  { label: 'Data Sources', href: '#data-trust', icon: <Database size={15} /> },
];

export default function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <CloudSun size={18} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-base text-foreground tracking-tight">AKASHVANI</span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">Weather Intelligence</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS?.map((link) => (
              <a
                key={link?.label}
                href={link?.href}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                {link?.icon}
                {link?.label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Globe size={15} />
              <span>Language</span>
            </button>
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center px-3 py-1.5 text-sm font-medium text-foreground border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              Login
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-1.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card px-4 py-3 space-y-1">
          {NAV_LINKS?.map((link) => (
            <a
              key={link?.label}
              href={link?.href}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link?.icon}
              {link?.label}
            </a>
          ))}
          <div className="pt-2 flex gap-2 border-t border-border mt-2">
            <Link href="/login" className="flex-1 text-center py-2 text-sm font-medium border border-border rounded-lg hover:bg-secondary transition-colors">
              Login
            </Link>
            <Link href="/login" className="flex-1 text-center py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
