"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


// Custom pulsing marker creator
const createPulseIcon = (color: string, size: number = 40, showIcon: boolean = true) => {
  const innerSize = showIcon ? 32 : size / 1.5;
  const glowSize = size / 2.5;
  return L.divIcon({
    className: "custom-div-icon bg-transparent border-none",
    html: `
      <div class="relative flex items-center justify-center" style="width: ${size}px; height: ${size}px; margin-left: -${size / 2}px; margin-top: -${size / 2}px;">
        <span class="absolute inline-flex h-full w-full rounded-full opacity-40 animate-ping" style="background-color: ${color};"></span>
        <div class="relative flex items-center justify-center rounded-full border border-white/30 backdrop-blur-md shadow-[0_0_${glowSize}px_rgba(255,255,255,0.3)]" style="width: ${innerSize}px; height: ${innerSize}px; background-color: ${color}cc;">
          ${showIcon ? `
          <svg xmlns="http://www.w3.org/2000/svg" width="${size * 0.4}" height="${size * 0.4}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-satellite">
            <path d="M13 7 9 3 5 7l4 4"/>
            <path d="m17 11 4 4-4 4-4-4"/>
            <path d="m8 12 4 4 6-6-4-4Z"/>
            <path d="m16 8 3-3"/>
            <path d="M9 21a6 6 0 0 0-6-6"/>
          </svg>` : ''}
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

export default function SatelliteTracker() {

  const [mounted, setMounted] = useState(false);
  const [issData, setIssData] = useState<{ lat: number, lng: number, alt: number, vel: number } | null>(null);

  // Memoize icons to prevent re-creation on each render
  const issIcon = React.useMemo(() => createPulseIcon("#f97316", 48, true), []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    setMounted(true);

    // Fetch ISS using WhereTheISS.at
    const fetchISS = async () => {
      try {
        const issUrl = process.env.NEXT_PUBLIC_ISS_API_URL || "https://api.wheretheiss.at/v1/satellites/25544";
        const res = await fetch(issUrl, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setIssData({
            lat: data.latitude,
            lng: data.longitude,
            alt: data.altitude,
            vel: data.velocity,
          });
        }
      } catch (err) {
        console.error("Failed to fetch ISS data:", err);
      }
    };

    fetchISS();
    const interval = setInterval(fetchISS, 10000); // Update every 10 seconds for performance

    return () => clearInterval(interval);
  }, []);


  if (!mounted) {
    return <div className="w-full h-full rounded-3xl bg-white/5 animate-pulse"></div>;
  }

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl relative z-10 shadow-2xl">
      <MapContainer
        center={[20, 0]} // Fixed center to avoid jumping on ISS update
        zoom={2}
        minZoom={2}
        maxBounds={[[-90, -180], [90, 180]]}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        style={{ height: '100%', width: '100%', backgroundColor: '#050508' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />


        {/* ISS Marker */}
        {issData && (
          <Marker position={[issData.lat, issData.lng]} icon={issIcon}>
            <Popup>
              <div className="font-sans p-1">
                <h3 className="font-bold text-base text-zinc-900 mb-1">International Space Station</h3>
                <p className="text-zinc-600 text-xs m-0">Altitude: {issData.alt.toFixed(2)} km</p>
                <p className="text-zinc-600 text-xs m-0">Velocity: {issData.vel.toFixed(2)} km/h</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Overlay to ensure map respects border-radius */}
      <div className="absolute inset-0 pointer-events-none rounded-3xl border border-white/10 shadow-[inset_0_0_30px_rgba(255,255,255,0.02)] z-[400]" />
    </div>
  );
}
