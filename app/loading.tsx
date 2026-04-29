import React from "react";
import { CardSkeleton } from "@/components/CardSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#030308] text-zinc-100 font-sans">
      <main className="relative z-10 container mx-auto px-4 py-8 md:px-8 space-y-16 max-w-7xl">
        
        {/* Hero Skeleton */}
        <section className="space-y-6">
          <div className="h-12 w-64 bg-white/5 rounded-xl animate-pulse" />
          <div className="relative w-full rounded-3xl border border-white/10 bg-white/5 overflow-hidden flex flex-col lg:flex-row animate-pulse">
            <div className="w-full lg:w-3/4 aspect-video bg-white/5 border-r border-white/10" />
            <div className="w-full lg:w-1/4 p-6 space-y-6 bg-white/[0.02]">
              <div className="h-6 w-3/4 bg-white/10 rounded" />
              <div className="space-y-4">
                <div className="h-16 w-full bg-white/5 rounded-xl" />
                <div className="h-16 w-full bg-white/5 rounded-xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Grid Skeletons */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-4 w-24 bg-white/5 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </section>

        {/* Map Skeleton */}
        <section className="space-y-6">
          <div className="h-8 w-64 bg-white/5 rounded-lg animate-pulse" />
          <div className="w-full h-[500px] rounded-3xl border border-white/10 bg-white/5 animate-pulse" />
        </section>

      </main>
    </div>
  );
}
