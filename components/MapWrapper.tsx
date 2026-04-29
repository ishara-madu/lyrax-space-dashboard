"use client";

import dynamic from "next/dynamic";
import React from "react";

const SatelliteTracker = dynamic(() => import("./SatelliteTracker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden group relative flex flex-col items-center justify-center p-8 text-center animate-pulse">
      <div className="relative w-24 h-24 mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.2)]">
        <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Initializing Orbital Telemetry...</h3>
    </div>
  ),
});

export default function MapWrapper() {
  return <SatelliteTracker />;
}
