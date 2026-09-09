'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudSun,
  TriangleAlert,
  Siren,
  MapPin,
  ShieldAlert,
  MessageCircle,
  Navigation,
} from 'lucide-react';

export default function DisasterIntelligence() {
  const [crisis, setCrisis] = useState(false);

  return (
    <section id="disaster" className="py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            When weather becomes a threat, AkashVani changes with it.
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            The interface transforms from weather-first to safety-first when an emergency is detected.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <button
              onClick={() => setCrisis(false)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                !crisis ? 'bg-primary text-white border-primary' : 'bg-card border-border text-muted-foreground hover:bg-secondary'
              }`}
            >
              Normal State
            </button>
            <button
              onClick={() => setCrisis(true)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                crisis ? 'bg-danger text-white border-danger' : 'bg-card border-border text-muted-foreground hover:bg-secondary'
              }`}
            >
              Crisis State
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!crisis ? (
              <motion.div
                key="normal"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <CloudSun size={20} className="text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Normal Conditions</p>
                    <p className="text-xs text-muted-foreground">No active warnings</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 bg-success/10 text-success text-xs font-semibold px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    Safe
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground mb-1">Weather Forecast</p>
                    <p className="text-sm font-semibold text-foreground">Partly Cloudy</p>
                    <p className="text-xs text-muted-foreground">31°C · Rain after 5 PM</p>
                  </div>
                  <div className="bg-secondary rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground mb-1">AI Insights</p>
                    <p className="text-sm font-semibold text-foreground">Low Risk</p>
                    <p className="text-xs text-muted-foreground">No severe weather</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="crisis"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="bg-red-950 border border-red-800 rounded-xl p-6 text-white"
              >
                {/* Warning header */}
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-red-800">
                  <Siren size={18} className="text-red-400" />
                  <span className="text-sm font-bold text-red-300 tracking-widest uppercase">Active Warning</span>
                  <span className="ml-auto text-[9px] font-semibold bg-red-800 text-red-200 px-2 py-0.5 rounded">LIVE Alert</span>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: <MessageCircle size={15} />, label: 'What is happening?', desc: 'Heavy rainfall warning issued for NCR region. Thunderstorm activity expected.' },
                    { icon: <MapPin size={15} />, label: 'Am I affected?', desc: 'Your location (Kolkata) is within the warning zone.' },
                    { icon: <ShieldAlert size={15} />, label: 'What should I do?', desc: 'Avoid low-lying areas. Stay indoors if possible. Monitor official updates.' },
                    { icon: <Navigation size={15} />, label: 'Nearest Safe Shelter', desc: '0.8 km — Community Hall, Sector 12 (LIVE)' },
                  ]?.map((item) => (
                    <div key={item?.label} className="flex gap-3 bg-red-900/50 rounded-xl p-3">
                      <div className="text-red-400 mt-0.5 flex-shrink-0">{item?.icon}</div>
                      <div>
                        <p className="text-xs font-semibold text-red-200 mb-0.5">{item?.label}</p>
                        <p className="text-xs text-red-300/80 leading-relaxed">{item?.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-5 w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors">
                  <TriangleAlert size={16} />
                  SOS — Emergency Assistance
                </button>

                <p className="text-[9px] text-red-400/60 text-center mt-3">
                  LIVE ALERT 
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
