'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  WifiOff,
  CloudSun,
  ShieldAlert,
  Bell,
  BookOpen,
  MapPin,
  TriangleAlert,
  Clock,
} from 'lucide-react';

const CACHED_ITEMS = [
  { icon: <CloudSun size={14} />, label: 'Latest Weather', status: 'Cached' },
  { icon: <ShieldAlert size={14} />, label: 'Risk Score', status: 'Saved' },
  { icon: <Bell size={14} />, label: 'Alerts', status: 'Cached' },
  { icon: <BookOpen size={14} />, label: 'Safety Instructions', status: 'Available' },
  { icon: <MapPin size={14} />, label: 'Shelters', status: 'Saved' },
  { icon: <TriangleAlert size={14} />, label: 'SOS Queue', status: 'Ready' },
];

export default function OfflineFirst() {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-secondary border border-border rounded-full px-3 py-1 mb-4">
              <WifiOff size={13} className="text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground">Offline-First Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              When the network goes down, safety shouldn't.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md">
              AkashVani caches critical weather data, risk scores, alerts and safety information so you're never left without guidance — even without connectivity.
            </p>
          </motion.div>

          {/* Right: offline UI */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            {/* Offline banner */}
            <div className="flex items-center gap-2.5 px-4 py-3 bg-amber-50 border-b border-amber-200">
              <WifiOff size={15} className="text-amber-600" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-amber-800">Wi-Fi unavailable</p>
                <p className="text-[10px] text-amber-600">OFFLINE MODE — Showing latest cached information</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-amber-600">
                <Clock size={10} />
                <span className="font-mono">14:32</span>
              </div>
            </div>

            {/* Cached items */}
            <div className="p-4">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Available Offline</p>
              <div className="grid grid-cols-2 gap-2">
                {CACHED_ITEMS?.map((item, i) => (
                  <motion.div
                    key={item?.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.06, duration: 0.3 }}
                    className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2"
                  >
                    <span className="text-primary">{item?.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{item?.label}</p>
                      <p className="text-[10px] text-success">{item?.status}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-[10px] text-muted-foreground text-center">
                  Never displays cached data as current · Last updated shown always
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
