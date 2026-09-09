'use client';

import React, { useState } from 'react';
import AlertBanner from './AlertBanner';
import RiskScoreCard from './RiskScoreCard';
import CurrentWeatherCard from './CurrentWeatherCard';
import AISummaryCard from './AISummaryCard';
import HourlyForecastStrip from './HourlyForecastStrip';
import AQICard from './AQICard';
import DisasterStatusGrid from './DisasterStatusGrid';
import WeatherCharts from './WeatherCharts';
import SavedLocationsBar from './SavedLocationsBar';
import { DEMO_ALERTS } from '@/lib/mockData';

export default function DashboardContent() {
  const [activeLocation, setActiveLocation] = useState('saved-home');
  const hasActiveAlert = DEMO_ALERTS?.some((a) => a?.severity === 'HIGH');

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 xl:px-8 2xl:px-10 py-4 lg:py-6 space-y-4 lg:space-y-5">
      {/* Saved locations quick-switcher */}
      <SavedLocationsBar activeLocation={activeLocation} onLocationChange={setActiveLocation} />

      {/* Active Alert Banner — shown when HIGH severity alert */}
      {hasActiveAlert && <AlertBanner />}

      {/* Bento Grid — Row 1: Risk Score (hero, 2-col) + Current Weather + AQI */}
      {/* Grid plan: 4 cols. Row1: RiskScore spans 2 + Weather 1 + AQI 1. Row2: AI summary 2 + Hourly 2. Row3: Disasters 4. Row4: Charts 2+2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
        {/* Risk Score — hero card spans 2 cols */}
        <div className="md:col-span-2 xl:col-span-2">
          <RiskScoreCard />
        </div>

        {/* Current Weather */}
        <div className="xl:col-span-1">
          <CurrentWeatherCard />
        </div>

        {/* AQI */}
        <div className="xl:col-span-1">
          <AQICard />
        </div>
      </div>

      {/* Row 2: AI Summary + Hourly Forecast */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-5">
        <AISummaryCard />
        <HourlyForecastStrip />
      </div>

      {/* Row 3: Disaster Status (full width) */}
      <DisasterStatusGrid />

      {/* Row 4: Charts */}
      <WeatherCharts />
    </div>
  );
}