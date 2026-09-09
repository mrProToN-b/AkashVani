'use client';

import React, { useState } from 'react';
import {
  X, MapPin, Thermometer, Droplets, AlertTriangle, Shield, MessageSquare,
  ChevronRight, Wind, Activity, Loader2, Volume2, Map, AlertCircle
} from 'lucide-react';
import type { SelectedMapLocation } from './MapPageContent';
import { askAssistant } from '@/lib/services/ai';
import { useVoiceAssistant } from '@/lib/hooks/useVoiceAssistant';

interface Props {
  location: SelectedMapLocation;
  onClose: () => void;
}

// Preview location weather data — Phase 2 replaces this with a live point-weather API call.
function getPreviewWeatherForLocation(lat: number, lng: number) {
  const baseTemp = 28 + Math.floor((lat % 5) * 2);
  const rainProb = Math.floor((lng % 10) * 8);
  const riskScore = 35 + Math.floor((lat % 8) * 5);
  return {
    temp: Math.max(20, Math.min(44, baseTemp)),
    feelsLike: Math.max(22, Math.min(48, baseTemp + 4)),
    humidity: 55 + Math.floor((lng % 6) * 5),
    windSpeed: 10 + Math.floor((lat % 7) * 3),
    rainProb: Math.max(5, Math.min(90, rainProb)),
    condition: rainProb > 60 ? 'Thunderstorm' : rainProb > 35 ? 'Partly Cloudy' : 'Clear',
    riskScore: Math.max(20, Math.min(85, riskScore)),
    riskLabel: riskScore > 65 ? 'High' : riskScore > 45 ? 'Moderate' : 'Low',
    nearestAlert: riskScore > 55 ? 'Thunderstorm Watch in effect' : 'No active warnings',
    recommendation: riskScore > 65
      ? 'Avoid outdoor activities. Lightning risk elevated. Seek shelter indoors.'
      : 'Conditions acceptable. Stay updated on forecast changes.',
  };
}

const FOLLOW_UP_QUESTIONS = [
  'Will it rain near this location after 5 PM?',
  'What is the flood risk here?',
  'Compare weather models for this area',
  'Nearest safe shelter from here',
];

export default function AskTheMapPanel({ location, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'weather' | 'risk' | 'ask'>('weather');
  const [askInput, setAskInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiError, setAiError] = useState('');

  const wx = getPreviewWeatherForLocation(location.lat, location.lng);
  const voice = useVoiceAssistant({ onFinalTranscript: async () => '' });

  const handleAsk = async (question: string) => {
    setAskInput(question);
    setIsThinking(true);
    setAiResponse('');
    setAiError('');

    const result = await askAssistant(question, [], {
      locationName: location.name,
      weather: wx,
      risk: { overall: wx.riskScore, label: wx.riskLabel },
    });

    setIsThinking(false);
    if (result.status === 'success' && result.data) {
      setAiResponse(result.data.text);
    } else {
      setAiError(result.error || 'AkashVani AI is unavailable right now.');
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-danger';
    if (score >= 50) return 'text-warning';
    if (score >= 30) return 'text-orange-500';
    return 'text-success';
  };

  return (
    <div className="map-panel border border-border rounded-2xl shadow-modal overflow-hidden animate-slide-in-right">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-primary/5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <MapPin size={15} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground leading-tight">{location.name}</p>
              <p className="text-[10px] font-mono-data text-muted-foreground mt-0.5">
                {location.lat}°N, {location.lng}°E
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
            <X size={15} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-3">
          {(['weather', 'risk', 'ask'] as const).map((tab) => (
            <button
              key={`map-tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              {tab === 'weather' ? 'Weather' : tab === 'risk' ? 'Risk' : 'Ask AI'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="p-4 max-h-[480px] overflow-y-auto scrollbar-hide">
        {/* Weather tab */}
        {activeTab === 'weather' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground tabular-nums">{wx.temp}°C</p>
                <p className="text-xs text-muted-foreground">{wx.condition} · Feels like {wx.feelsLike}°C</p>
              </div>
              <span className="text-xs font-semibold demo-badge px-2 py-1 rounded-full">PREVIEW DATA</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: <Droplets size={13} />, label: 'Humidity', value: `${wx.humidity}%` },
                { icon: <Wind size={13} />, label: 'Wind', value: `${wx.windSpeed} km/h` },
                { icon: <Droplets size={13} className="text-blue-500" />, label: 'Rain Prob', value: `${wx.rainProb}%` },
                { icon: <Thermometer size={13} />, label: 'Feels Like', value: `${wx.feelsLike}°C` },
              ].map((stat) => (
                <div key={`stat-${stat.label}`} className="bg-secondary/50 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">{stat.icon}<span className="text-[10px] uppercase tracking-wide font-medium">{stat.label}</span></div>
                  <p className="text-sm font-bold text-foreground font-mono-data">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-secondary/40 rounded-xl p-3">
              <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
                <AlertTriangle size={13} className="text-warning" /> Nearest Alert
              </p>
              <p className="text-xs text-muted-foreground">{wx.nearestAlert}</p>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/15 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                <Map size={13} /> View Radar
              </button>
              <button className="flex-1 text-xs font-semibold text-muted-foreground bg-secondary hover:bg-secondary/80 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                <Activity size={13} /> Compare Models
              </button>
            </div>
          </div>
        )}

        {/* Risk tab */}
        {activeTab === 'risk' && (
          <div className="space-y-3 animate-fade-in">
            <div className="text-center py-3">
              <p className={`text-4xl font-bold tabular-nums ${getRiskColor(wx.riskScore)}`}>{wx.riskScore}</p>
              <p className="text-sm text-muted-foreground mt-1">Risk Score · {wx.riskLabel}</p>
              <div className="w-full bg-secondary rounded-full h-2 mt-3">
                <div
                  className={`h-2 rounded-full transition-all ${
                    wx.riskScore >= 70 ? 'bg-danger' : wx.riskScore >= 50 ? 'bg-warning' : 'bg-success'
                  }`}
                  style={{ width: `${wx.riskScore}%` }}
                />
              </div>
            </div>

            <div className="bg-secondary/40 rounded-xl p-3">
              <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <Shield size={13} className="text-primary" /> Recommended Action
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">{wx.recommendation}</p>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Rain', val: Math.min(90, wx.rainProb + 10) },
                { label: 'Heat', val: wx.temp > 38 ? 72 : 35 },
                { label: 'Wind', val: wx.windSpeed > 40 ? 65 : 25 },
                { label: 'Lightning', val: wx.rainProb > 50 ? 78 : 20 },
                { label: 'Flood', val: wx.rainProb > 60 ? 55 : 18 },
                { label: 'AQI', val: 45 },
              ].map((r) => (
                <div key={`risk-item-${r.label}`} className="bg-secondary/50 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-muted-foreground font-medium">{r.label}</p>
                  <p className={`text-xs font-bold tabular-nums mt-0.5 ${r.val >= 70 ? 'text-danger' : r.val >= 50 ? 'text-warning' : 'text-success'}`}>{r.val}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('ask')}
              className="w-full text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/15 px-3 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageSquare size={13} /> Ask AI about this location
            </button>
          </div>
        )}

        {/* Ask AI tab */}
        {activeTab === 'ask' && (
          <div className="space-y-3 animate-fade-in">
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-3">
              <p className="text-xs font-semibold text-accent mb-1">Ask about this location</p>
              <p className="text-[10px] text-muted-foreground">
                AkashVani AI interprets weather data for <strong>{location.name}</strong>. Responses are AI-generated, not official forecasts.
              </p>
            </div>

            {/* Quick questions */}
            <div className="space-y-1.5">
              {FOLLOW_UP_QUESTIONS.map((q) => (
                <button
                  key={`fq-${q}`}
                  onClick={() => handleAsk(q)}
                  className="w-full text-left text-xs text-foreground bg-secondary/50 hover:bg-secondary rounded-xl px-3 py-2 transition-colors flex items-center gap-2"
                >
                  <ChevronRight size={12} className="text-primary flex-shrink-0" />
                  {q}
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askInput.trim() && handleAsk(askInput)}
                placeholder="Ask anything about this location..."
                className="flex-1 text-xs bg-input border border-border rounded-xl px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={() => askInput.trim() && handleAsk(askInput)}
                disabled={!askInput.trim() || isThinking}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50"
              >
                Ask
              </button>
            </div>

            {/* AI response */}
            {isThinking && (
              <div className="flex items-center gap-2 bg-secondary/40 rounded-xl p-3">
                <Loader2 size={14} className="animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">AkashVani is thinking...</span>
              </div>
            )}

            {aiError && !isThinking && (
              <div className="bg-warning/10 border border-warning/25 rounded-xl p-3 flex items-start gap-2 animate-fade-in">
                <AlertCircle size={13} className="text-warning flex-shrink-0 mt-0.5" />
                <p className="text-xs text-foreground leading-relaxed">{aiError}</p>
              </div>
            )}

            {aiResponse && !isThinking && (
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-3 animate-fade-in">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-xs font-semibold text-accent">AkashVani AI</span>
                  <span className="ai-badge text-[10px] font-semibold px-1.5 py-0.5 rounded-full">AI INTERPRETATION</span>
                </div>
                <p className="text-xs text-foreground leading-relaxed">{aiResponse}</p>
                <button
                  onClick={() => voice.speak(aiResponse)}
                  className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Volume2 size={11} /> Read aloud
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}