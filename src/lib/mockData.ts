// Backend integration point: Replace all exports with real API service calls

export const DEMO_LOCATIONS = [
  { id: 'loc-delhi', name: 'Kolkata', lat: 28.6139, lng: 77.209, state: 'Delhi' },
  { id: 'loc-mumbai', name: 'Mumbai', lat: 19.076, lng: 72.8777, state: 'Maharashtra' },
  { id: 'loc-chennai', name: 'Chennai', lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
  { id: 'loc-bengaluru', name: 'Bengaluru', lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  { id: 'loc-kolkata', name: 'Kolkata', lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
  { id: 'loc-hyderabad', name: 'Hyderabad', lat: 17.385, lng: 78.4867, state: 'Telangana' },
  { id: 'loc-guwahati', name: 'Guwahati', lat: 26.1445, lng: 91.7362, state: 'Assam' },
  { id: 'loc-kochi', name: 'Kochi', lat: 9.9312, lng: 76.2673, state: 'Kerala' },
];

export const DEMO_WEATHER = {
  location: 'Kolkata',
  state: 'Delhi',
  lat: 28.6139,
  lng: 77.209,
  temp: 34,
  feelsLike: 38,
  condition: 'Partly Cloudy',
  conditionCode: 'partly-cloudy',
  humidity: 72,
  windSpeed: 18,
  windDir: 'SW',
  visibility: 6.4,
  pressure: 1002,
  uvIndex: 7,
  precipitation: 2.4,
  dewPoint: 28,
  cloudCover: 45,
  sunrise: '06:02',
  sunset: '18:41',
  moonPhase: 'Waxing Gibbous',
  lastUpdated: '2026-09-08T17:45:00+05:30',
  dataType: 'OBSERVED',
  source: 'IMD Safdarjung Observatory',
};

export const DEMO_RISK = {
  overall: 68,
  label: 'High',
  color: 'high',
  breakdown: [
    { id: 'risk-rain', category: 'Rain', score: 75, trend: 'up', severity: 'High' },
    { id: 'risk-flood', category: 'Flood', score: 52, trend: 'up', severity: 'Moderate' },
    { id: 'risk-lightning', category: 'Lightning', score: 80, trend: 'up', severity: 'High' },
    { id: 'risk-heat', category: 'Heat', score: 71, trend: 'stable', severity: 'High' },
    { id: 'risk-wind', category: 'Wind', score: 38, trend: 'down', severity: 'Low' },
    { id: 'risk-cyclone', category: 'Cyclone', score: 15, trend: 'stable', severity: 'Low' },
    { id: 'risk-aqi', category: 'AQI', score: 63, trend: 'up', severity: 'Moderate' },
    { id: 'risk-fog', category: 'Fog', score: 20, trend: 'stable', severity: 'Low' },
  ],
  explanation:
    'Risk is elevated due to active thunderstorm development over NCR region. Lightning and heavy rainfall probability exceeds 80% for the next 6 hours. Heat stress remains high with apparent temperature near 38°C.',
  lastUpdated: '2026-09-08T17:50:00+05:30',
};

export const DEMO_HOURLY_FORECAST = [
  { id: 'hr-0', time: '18:00', temp: 34, feelsLike: 38, rain: 15, rainProb: 35, windSpeed: 18, condition: 'Partly Cloudy', icon: 'cloud-sun' },
  { id: 'hr-1', time: '19:00', temp: 32, feelsLike: 36, rain: 28, rainProb: 65, windSpeed: 24, condition: 'Thunderstorm', icon: 'storm' },
  { id: 'hr-2', time: '20:00', temp: 29, feelsLike: 33, rain: 42, rainProb: 82, windSpeed: 32, condition: 'Heavy Rain', icon: 'rain-heavy' },
  { id: 'hr-3', time: '21:00', temp: 27, feelsLike: 30, rain: 38, rainProb: 78, windSpeed: 28, condition: 'Heavy Rain', icon: 'rain-heavy' },
  { id: 'hr-4', time: '22:00', temp: 26, feelsLike: 29, rain: 22, rainProb: 55, windSpeed: 22, condition: 'Rain', icon: 'rain' },
  { id: 'hr-5', time: '23:00', temp: 25, feelsLike: 27, rain: 8, rainProb: 30, windSpeed: 16, condition: 'Overcast', icon: 'cloud' },
  { id: 'hr-6', time: '00:00', temp: 24, feelsLike: 26, rain: 3, rainProb: 18, windSpeed: 12, condition: 'Mostly Cloudy', icon: 'cloud' },
  { id: 'hr-7', time: '01:00', temp: 24, feelsLike: 25, rain: 1, rainProb: 12, windSpeed: 10, condition: 'Partly Cloudy', icon: 'cloud-moon' },
  { id: 'hr-8', time: '02:00', temp: 23, feelsLike: 24, rain: 0, rainProb: 8, windSpeed: 9, condition: 'Clear', icon: 'moon' },
  { id: 'hr-9', time: '03:00', temp: 23, feelsLike: 24, rain: 0, rainProb: 6, windSpeed: 8, condition: 'Clear', icon: 'moon' },
  { id: 'hr-10', time: '04:00', temp: 23, feelsLike: 24, rain: 0, rainProb: 5, windSpeed: 9, condition: 'Clear', icon: 'moon' },
  { id: 'hr-11', time: '05:00', temp: 24, feelsLike: 25, rain: 2, rainProb: 14, windSpeed: 11, condition: 'Partly Cloudy', icon: 'cloud-sun' },
];

export const DEMO_TEMP_TREND = [
  { id: 'tt-0', time: '06:00', temp: 28, feelsLike: 30 },
  { id: 'tt-1', time: '08:00', temp: 30, feelsLike: 33 },
  { id: 'tt-2', time: '10:00', temp: 32, feelsLike: 36 },
  { id: 'tt-3', time: '12:00', temp: 35, feelsLike: 40 },
  { id: 'tt-4', time: '14:00', temp: 36, feelsLike: 42 },
  { id: 'tt-5', time: '16:00', temp: 35, feelsLike: 40 },
  { id: 'tt-6', time: '18:00', temp: 34, feelsLike: 38 },
  { id: 'tt-7', time: '20:00', temp: 29, feelsLike: 33 },
  { id: 'tt-8', time: '22:00', temp: 26, feelsLike: 29 },
  { id: 'tt-9', time: '00:00', temp: 24, feelsLike: 26 },
];

export const DEMO_AQI = {
  value: 187,
  category: 'Unhealthy',
  color: 'danger',
  primaryPollutant: 'PM2.5',
  pm25: 98.4,
  pm10: 142.6,
  no2: 48.2,
  o3: 62.1,
  co: 1.4,
  so2: 12.8,
  healthConcern: 'Members of sensitive groups may experience health effects. General public less likely to be affected.',
  recommendation: 'Avoid prolonged outdoor exertion. Wear N95 mask if going outside.',
  lastUpdated: '2026-09-08T17:30:00+05:30',
  source: 'CPCB — Delhi Monitoring Network',
};

export const DEMO_ALERTS = [
  {
    id: 'alert-001',
    type: 'THUNDERSTORM',
    severity: 'HIGH',
    title: 'Thunderstorm Warning — NCR Region',
    agency: 'India Meteorological Department',
    agencyCode: 'IMD',
    region: 'Delhi, NCR, Gurugram, Noida',
    issuedAt: '2026-09-08T15:30:00+05:30',
    validUntil: '2026-09-08T23:00:00+05:30',
    message:
      'Thunderstorm with heavy rainfall (40–60mm) and lightning expected over Delhi-NCR. Gusty winds 50–70 km/h possible. Avoid open areas.',
    isDemoAlert: true,
    color: 'warning',
  },
  {
    id: 'alert-002',
    type: 'HEAT',
    severity: 'MODERATE',
    title: 'Heat Advisory — Daytime Temperatures',
    agency: 'India Meteorological Department',
    agencyCode: 'IMD',
    region: 'Delhi, Haryana, Rajasthan',
    issuedAt: '2026-09-08T06:00:00+05:30',
    validUntil: '2026-09-09T18:00:00+05:30',
    message:
      'Maximum temperatures likely to remain 3–5°C above normal. Heat stress conditions for outdoor workers. Stay hydrated.',
    isDemoAlert: true,
    color: 'warning',
  },
];

export const DEMO_DISASTERS = [
  { id: 'dis-cyclone', type: 'Cyclone', status: 'Watch', severity: 'LOW', region: 'Bay of Bengal', detail: 'Low pressure system forming. 72-hr track uncertain.', icon: 'wind' },
  { id: 'dis-flood', type: 'Flood', status: 'Warning', severity: 'MODERATE', region: 'Assam, Bihar', detail: 'Brahmaputra above warning level at Guwahati.', icon: 'droplets' },
  { id: 'dis-earthquake', type: 'Earthquake', status: 'None', severity: 'LOW', region: 'No recent activity', detail: 'No significant seismic activity in 24h.', icon: 'activity' },
  { id: 'dis-landslide', type: 'Landslide', status: 'Alert', severity: 'MODERATE', region: 'Uttarakhand, HP', detail: 'Saturated soil conditions. Avoid hill roads.', icon: 'mountain' },
  { id: 'dis-heatwave', type: 'Heatwave', status: 'Active', severity: 'HIGH', region: 'Delhi, Haryana, UP', detail: 'Day 3 of heat event. Apparent temp 42–46°C.', icon: 'thermometer' },
  { id: 'dis-lightning', type: 'Lightning', status: 'Warning', severity: 'HIGH', region: 'Delhi-NCR, UP', detail: 'High lightning strike probability next 6 hours.', icon: 'zap' },
];

export const DEMO_AI_SUMMARY = {
  text: 'Heavy thunderstorm activity developing over Delhi-NCR this evening. Lightning strike risk is HIGH — avoid open areas, rooftops, and water bodies between 7–10 PM. Carry rain gear if commuting. AQI is Unhealthy (187); N95 recommended outdoors. Heat stress elevated until thunderstorm brings relief after 9 PM.',
  confidence: 84,
  sources: ['IMD Thunderstorm Warning', 'Radar Observation', 'CPCB AQI', 'NWP Model GFS'],
  generatedAt: '2026-09-08T17:52:00+05:30',
  persona: 'Default',
};

export const DEMO_SAVED_LOCATIONS = [
  { id: 'saved-home', label: 'Home', name: 'Agarpara, Kolkata', temp: 34, condition: 'Thunderstorm', risk: 68, alertCount: 2 },
  { id: 'saved-office', label: 'Office', name: 'Connaught Place, Delhi', temp: 35, condition: 'Partly Cloudy', risk: 55, alertCount: 1 },
  { id: 'saved-family', label: 'Family', name: 'Lucknow, UP', temp: 36, condition: 'Clear', risk: 42, alertCount: 0 },
];

export const DEMO_MAP_ALERTS = [
  { id: 'map-alert-001', lat: 28.6139, lng: 77.209, type: 'THUNDERSTORM', severity: 'HIGH', title: 'Thunderstorm Warning — Delhi NCR', agency: 'IMD' },
  { id: 'map-alert-002', lat: 26.1445, lng: 91.7362, type: 'FLOOD', severity: 'MODERATE', title: 'Flood Warning — Brahmaputra', agency: 'CWC' },
  { id: 'map-alert-003', lat: 19.076, lng: 72.8777, type: 'RAIN', severity: 'LOW', title: 'Heavy Rain Watch — Mumbai Coast', agency: 'IMD' },
  { id: 'map-alert-004', lat: 13.0827, lng: 80.2707, type: 'CYCLONE', severity: 'LOW', title: 'Cyclone Watch — Bay of Bengal', agency: 'IMD' },
];

export const DEMO_SHELTERS = [
  { id: 'shelter-001', name: 'Indira Gandhi Indoor Stadium', lat: 28.6253, lng: 77.2402, capacity: 8000, distance: '3.2 km', status: 'Open', accessibility: true },
  { id: 'shelter-002', name: 'Talkatora Indoor Stadium', lat: 28.6268, lng: 77.1997, capacity: 2000, distance: '4.8 km', status: 'Open', accessibility: true },
  { id: 'shelter-003', name: 'DDA Sports Complex Agarpara', lat: 28.5921, lng: 77.0523, capacity: 1200, distance: '6.1 km', status: 'Open', accessibility: false },
];

export const PERSONAS = [
  { id: 'persona-default', key: 'default', label: 'Default', description: 'General weather awareness for everyday use', icon: '🌤️', color: 'primary' },
  { id: 'persona-urban', key: 'urban', label: 'Urban', description: 'City commuter — traffic, air quality, heat', icon: '🏙️', color: 'accent' },
  { id: 'persona-rural', key: 'rural', label: 'Rural', description: 'Village life — storms, power, road conditions', icon: '🌾', color: 'success' },
  { id: 'persona-farmer', key: 'farmer', label: 'Farmer', description: 'Crop planning — rain, soil, humidity, frost', icon: '🌱', color: 'success' },
  { id: 'persona-marine', key: 'marine', label: 'Marine', description: 'Sea conditions — waves, wind, visibility', icon: '⛵', color: 'accent' },
  { id: 'persona-aviation', key: 'aviation', label: 'Aviation', description: 'Flight safety — turbulence, visibility, icing', icon: '✈️', color: 'primary' },
];

export const LANGUAGES = [
  { id: 'lang-en', code: 'en', label: 'English', native: 'English' },
  { id: 'lang-hi', code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { id: 'lang-bn', code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { id: 'lang-ta', code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { id: 'lang-te', code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { id: 'lang-kn', code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { id: 'lang-ml', code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { id: 'lang-mr', code: 'mr', label: 'Marathi', native: 'मराठी' },
  { id: 'lang-gu', code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { id: 'lang-or', code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
];