'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Languages, Volume2 } from 'lucide-react';

const LANGUAGES = [
  'English', 'हिन्दी', 'বাংলা', 'தமிழ்', 'తెలుగు',
  'ಕನ್ನಡ', 'മലയാളം', 'मराठी', 'ગુજરાતી', 'ଓଡ଼ିଆ', 'ਪੰਜਾਬੀ', 'অসমীয়া',
];

export default function MultilingualSection() {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: language grid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 mb-4">
              <Languages size={13} className="text-indigo-600" />
              <span className="text-xs font-semibold text-indigo-600">12 Indian Languages</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Weather in the language you understand.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-md">
              AkashVani speaks your language — from weather forecasts to disaster alerts and AI guidance.
            </p>

            <div className="flex flex-wrap gap-2">
              {LANGUAGES?.map((lang, i) => (
                <motion.button
                  key={lang}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    i === 0
                      ? 'bg-primary text-white border-primary' :'bg-card border-border text-foreground hover:bg-secondary hover:border-primary/30'
                  }`}
                >
                  {lang}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Right: conversation example */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border bg-secondary/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">हिन्दी — Hindi</span>
                <span className="text-[9px] demo-badge px-1.5 py-0.5 rounded font-semibold">LIVE</span>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* User */}
              <div className="flex justify-end">
                <div className="bg-primary text-white text-sm rounded-xl rounded-tr-sm px-4 py-2.5 max-w-xs">
                  क्या कल बारिश होगी?
                </div>
              </div>

              {/* AI */}
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5 text-primary font-bold text-xs">
                  अ
                </div>
                <div className="flex-1">
                  <div className="bg-secondary border border-border text-sm rounded-xl rounded-tl-sm px-4 py-3 text-foreground leading-relaxed">
                    कल दोपहर के बाद बारिश की संभावना बढ़ सकती है। शाम 4 बजे के बाद भारी वर्षा का अनुमान है।
                  </div>
                  <div className="flex items-center gap-2 mt-2 px-1">
                    <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors">
                      <Volume2 size={11} />
                      सुनें
                    </button>
                    <span className="text-[9px] demo-badge px-1.5 py-0.5 rounded font-semibold">LIVE DATA</span>
                  </div>
                </div>
              </div>

              {/* English example */}
              <div className="pt-2 border-t border-border">
                <p className="text-[10px] text-muted-foreground mb-2 font-medium">Also available in:</p>
                <div className="flex flex-wrap gap-1.5">
                  {['বাংলা', 'தமிழ்', 'తెలుగు', 'ಕನ್ನಡ', 'മലയാളം']?.map((l) => (
                    <span key={l} className="text-xs px-2 py-0.5 bg-secondary border border-border rounded-full text-muted-foreground">
                      {l}
                    </span>
                  ))}
                  <span className="text-xs px-2 py-0.5 bg-secondary border border-border rounded-full text-muted-foreground">+7 more</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
