'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, MapPin, Clock, BarChart2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AskAkashVani() {
  return (
    <section id="ask-akashvani" className="py-16 lg:py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-3 py-1 mb-4">
              <Bot size={13} className="text-accent" />
              <span className="text-xs font-semibold text-accent">AI Weather Assistant</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Ask your weather.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-md">
              AkashVani combines real-time weather data, forecast models, official alerts and AI reasoning to answer your specific weather questions.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all"
            >
              Ask AkashVani
              <ArrowRight size={15} />
            </Link>
          </motion.div>

          {/* Right: AI chat preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            {/* Chat header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-secondary/40">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <Bot size={14} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">AkashVani AI</p>
                <p className="text-[10px] text-muted-foreground">Weather Intelligence Assistant</p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] text-success font-medium">Active</span>
              </div>
            </div>

            {/* Messages */}
            <div className="p-4 space-y-4">
              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-primary text-white text-sm rounded-xl rounded-tr-sm px-4 py-2.5 max-w-xs">
                  Will it rain near my college after 5 PM?
                </div>
              </div>

              {/* AI response */}
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot size={14} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="bg-secondary border border-border text-sm rounded-xl rounded-tl-sm px-4 py-3 text-foreground leading-relaxed">
                    Rain is likely after 5 PM, with higher probability between 5:30 and 7 PM. No severe-weather warning is currently active for this location.
                  </div>
                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-3 mt-2 px-1">
                    <div className="flex items-center gap-1">
                      <MapPin size={10} className="text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Kolkata</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={10} className="text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Updated 5m ago</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart2 size={10} className="text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Confidence: High</span>
                    </div>
                    <span className="text-[9px] font-semibold demo-badge px-1.5 py-0.5 rounded">Preview</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Input bar */}
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 bg-secondary border border-border rounded-xl px-3 py-2.5">
                <span className="text-sm text-muted-foreground flex-1">Ask AkashVani anything about the weather...</span>
                <button className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <ArrowRight size={13} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
