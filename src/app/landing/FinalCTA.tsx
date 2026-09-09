'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navigation, ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/20 rounded-full px-3 py-1 mb-6">
            <Navigation size={12} className="text-primary" />
            <span className="text-xs font-semibold text-primary">AkashVani</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
            Your weather. Your location.{' '}
            <span className="text-primary">Your decision.</span>
          </h2>

          <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Get personalized weather intelligence, risk insights, disaster information and AI assistance in one place.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm hover:shadow-md text-base"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3 bg-card border border-border text-foreground font-semibold rounded-xl hover:bg-secondary transition-all text-base"
            >
              Login
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            Free to use · No account required to explore
          </p>
        </motion.div>
      </div>
    </section>
  );
}
