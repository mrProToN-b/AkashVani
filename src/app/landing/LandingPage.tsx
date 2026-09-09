'use client';

import React from 'react';
import LandingHeader from './LandingHeader';
import HeroSection from './HeroSection';
import TrustStrip from './TrustStrip';
import DataToDecisions from './DataToDecisions';
import ScientificIntelligence from './ScientificIntelligence';
import ModelComparison from './ModelComparison';
import WeatherProductLibrary from './WeatherProductLibrary';
import LiveMapPreview from './LiveMapPreview';
import AskAkashVani from './AskAkashVani';
import MultilingualSection from './MultilingualSection';
import PersonalizedWeather from './PersonalizedWeather';
import DisasterIntelligence from './DisasterIntelligence';
import WeatherRisk from './WeatherRisk';
import OfflineFirst from './OfflineFirst';
import DataTrust from './DataTrust';
import FinalCTA from './FinalCTA';
import LandingFooter from './LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main>
        <HeroSection />
        <TrustStrip />
        <DataToDecisions />
        <ScientificIntelligence />
        <ModelComparison />
        <WeatherProductLibrary />
        <LiveMapPreview />
        <AskAkashVani />
        <MultilingualSection />
        <PersonalizedWeather />
        <DisasterIntelligence />
        <WeatherRisk />
        <OfflineFirst />
        <DataTrust />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
