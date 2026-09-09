'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const TempTrendChart = dynamic(() => import('./TempTrendChart'), { ssr: false });
const RainfallChart = dynamic(() => import('./RainfallChart'), { ssr: false });

export default function WeatherCharts() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-5">
      <TempTrendChart />
      <RainfallChart />
    </div>
  );
}