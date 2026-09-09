'use client';

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { DEMO_MAP_ALERTS, DEMO_SHELTERS } from '@/lib/mockData';
import type { MapLayer, SelectedMapLocation } from './MapPageContent';

// Fix leaflet default icon issue in Next.js
if (typeof window !== 'undefined') {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

const ALERT_COLORS: Record<string, string> = {
  THUNDERSTORM: '#F59E0B',
  FLOOD: '#3B82F6',
  RAIN: '#60A5FA',
  CYCLONE: '#8B5CF6',
  HEATWAVE: '#EF4444',
};

const CYCLONE_TRACK = [
  [8.5, 85.2],
  [10.2, 84.8],
  [12.1, 84.1],
  [13.8, 83.2],
  [15.4, 82.1],
  [16.9, 80.8],
] as [number, number][];

// Mock temperature overlay data points
const TEMP_POINTS = [
  { id: 'tp-del', lat: 28.6139, lng: 77.209, temp: 34, label: 'Delhi' },
  { id: 'tp-mum', lat: 19.076, lng: 72.8777, temp: 29, label: 'Mumbai' },
  { id: 'tp-che', lat: 13.0827, lng: 80.2707, temp: 32, label: 'Chennai' },
  { id: 'tp-ben', lat: 12.9716, lng: 77.5946, temp: 27, label: 'Bengaluru' },
  { id: 'tp-kol', lat: 22.5726, lng: 88.3639, temp: 31, label: 'Kolkata' },
  { id: 'tp-hyd', lat: 17.385, lng: 78.4867, temp: 35, label: 'Hyderabad' },
  { id: 'tp-gwh', lat: 26.1445, lng: 91.7362, temp: 28, label: 'Guwahati' },
  { id: 'tp-koc', lat: 9.9312, lng: 76.2673, temp: 26, label: 'Kochi' },
  { id: 'tp-ahm', lat: 23.0225, lng: 72.5714, temp: 38, label: 'Ahmedabad' },
  { id: 'tp-jai', lat: 26.9124, lng: 75.7873, temp: 40, label: 'Jaipur' },
];

function getTempColor(temp: number): string {
  if (temp >= 40) return '#DC2626';
  if (temp >= 36) return '#EA580C';
  if (temp >= 32) return '#F59E0B';
  if (temp >= 28) return '#84CC16';
  if (temp >= 24) return '#22D3EE';
  return '#3B82F6';
}

function MapClickHandler({ onLocationClick }: { onLocationClick: (loc: SelectedMapLocation) => void }) {
  useMapEvents({
    click(e) {
      onLocationClick({
        lat: parseFloat(e.latlng.lat.toFixed(4)),
        lng: parseFloat(e.latlng.lng.toFixed(4)),
        name: `${e.latlng.lat.toFixed(3)}°N, ${e.latlng.lng.toFixed(3)}°E`,
      });
    },
  });
  return null;
}

interface Props {
  layers: MapLayer[];
  timelineIndex: number;
  onLocationClick: (loc: SelectedMapLocation) => void;
}

export default function LeafletMap({ layers, timelineIndex, onLocationClick }: Props) {
  const isLayerActive = (id: string) => layers.find((l) => l.id === id)?.active ?? false;

  const alertIcon = (color: string) =>
    L.divIcon({
      className: '',
      html: `<div style="width:28px;height:28px;background:${color};border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:12px;">⚠</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

  const shelterIcon = L.divIcon({
    className: '',
    html: `<div style="width:24px;height:24px;background:#10B981;border:2px solid white;border-radius:6px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.2);font-size:11px;">🏠</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
    >
      {/* Base tile layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onLocationClick={onLocationClick} />

      {/* Temperature overlay circles */}
      {isLayerActive('layer-temp') &&
        TEMP_POINTS.map((pt) => (
          <React.Fragment key={pt.id}>
            <Circle
              center={[pt.lat, pt.lng]}
              radius={120000}
              pathOptions={{
                fillColor: getTempColor(pt.temp),
                fillOpacity: 0.35,
                color: getTempColor(pt.temp),
                weight: 1,
                opacity: 0.6,
              }}
            />
            <Marker
              position={[pt.lat, pt.lng]}
              icon={L.divIcon({
                className: '',
                html: `<div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:2px 6px;font-size:11px;font-weight:700;color:${getTempColor(pt.temp)};box-shadow:0 1px 4px rgba(0,0,0,0.15);white-space:nowrap;font-family:monospace;">${pt.temp}°C</div>`,
                iconSize: [52, 22],
                iconAnchor: [26, 11],
              })}
            >
              <Popup>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13 }}>
                  <strong>{pt.label}</strong>
                  <br />
                  Temperature: <strong>{pt.temp}°C</strong>
                  <br />
                  <em style={{ fontSize: 11, color: '#64748b' }}>LIVE DATA</em>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

      {/* Alert zone overlays */}
      {isLayerActive('layer-alerts-overlay') &&
        DEMO_MAP_ALERTS.map((alert) => (
          <React.Fragment key={alert.id}>
            <Circle
              center={[alert.lat, alert.lng]}
              radius={150000}
              pathOptions={{
                fillColor: ALERT_COLORS[alert.type] || '#F59E0B',
                fillOpacity: 0.12,
                color: ALERT_COLORS[alert.type] || '#F59E0B',
                weight: 2,
                opacity: 0.7,
                dashArray: '6 4',
              }}
            />
            <Marker
              position={[alert.lat, alert.lng]}
              icon={alertIcon(ALERT_COLORS[alert.type] || '#F59E0B')}
            >
              <Popup>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, maxWidth: 200 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{alert.title}</div>
                  <div style={{ color: '#64748b', fontSize: 11 }}>Agency: {alert.agency}</div>
                  <div style={{ color: '#64748b', fontSize: 11 }}>Type: {alert.type}</div>
                  <div style={{ color: '#64748b', fontSize: 11 }}>Severity: {alert.severity}</div>
                  <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 4, padding: '3px 6px', marginTop: 6, fontSize: 10, fontWeight: 600, color: '#92400e' }}>
                    LIVE ALERT 
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

      {/* Cyclone track */}
      {isLayerActive('layer-cyclone') && (
        <>
          <Polyline
            positions={CYCLONE_TRACK}
            pathOptions={{ color: '#8B5CF6', weight: 3, dashArray: '8 4', opacity: 0.8 }}
          />
          {CYCLONE_TRACK.map((pos, i) => (
            <Circle
              key={`cyc-${i}`}
              center={pos}
              radius={i === CYCLONE_TRACK.length - 1 ? 80000 : 40000}
              pathOptions={{
                fillColor: '#8B5CF6',
                fillOpacity: i === CYCLONE_TRACK.length - 1 ? 0.2 : 0.1,
                color: '#8B5CF6',
                weight: i === CYCLONE_TRACK.length - 1 ? 2 : 1,
                opacity: 0.6,
              }}
            />
          ))}
        </>
      )}

      {/* Flood zones */}
      {isLayerActive('layer-flood') && (
        <>
          <Circle center={[26.1445, 91.7362]} radius={200000} pathOptions={{ fillColor: '#3B82F6', fillOpacity: 0.2, color: '#3B82F6', weight: 2 }} />
          <Circle center={[25.5941, 85.1376]} radius={150000} pathOptions={{ fillColor: '#60A5FA', fillOpacity: 0.18, color: '#60A5FA', weight: 1.5 }} />
        </>
      )}

      {/* Heatwave overlay */}
      {isLayerActive('layer-heatwave') && (
        <>
          <Circle center={[28.6139, 77.209]} radius={250000} pathOptions={{ fillColor: '#EF4444', fillOpacity: 0.15, color: '#EF4444', weight: 2 }} />
          <Circle center={[26.9124, 75.7873]} radius={200000} pathOptions={{ fillColor: '#F97316', fillOpacity: 0.18, color: '#F97316', weight: 1.5 }} />
        </>
      )}

      {/* AQI overlay */}
      {isLayerActive('layer-aqi') && (
        <>
          <Circle center={[28.6139, 77.209]} radius={180000} pathOptions={{ fillColor: '#F97316', fillOpacity: 0.25, color: '#F97316', weight: 2 }} />
          <Circle center={[23.0225, 72.5714]} radius={120000} pathOptions={{ fillColor: '#F59E0B', fillOpacity: 0.2, color: '#F59E0B', weight: 1.5 }} />
          <Circle center={[22.5726, 88.3639]} radius={130000} pathOptions={{ fillColor: '#EF4444', fillOpacity: 0.2, color: '#EF4444', weight: 1.5 }} />
        </>
      )}

      {/* Shelters */}
      {isLayerActive('layer-shelters') &&
        DEMO_SHELTERS.map((shelter) => (
          <Marker key={shelter.id} position={[shelter.lat, shelter.lng]} icon={shelterIcon}>
            <Popup>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13 }}>
                <strong>{shelter.name}</strong>
                <br />
                Capacity: {shelter.capacity.toLocaleString()}
                <br />
                Status: <strong style={{ color: '#10B981' }}>{shelter.status}</strong>
                <br />
                Distance: {shelter.distance}
                <br />
                <em style={{ fontSize: 11, color: '#64748b' }}>LIVE DATA</em>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}