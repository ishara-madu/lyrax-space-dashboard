import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#030308] text-zinc-100 font-sans">
      <main className="relative z-10 container mx-auto px-4 py-8 md:px-8 space-y-16 max-w-7xl">
        
        {/* Hero Skeleton */}
        <section className="space-y-6">
          <div className="h-12 w-64 bg-white/5 rounded-xl animate-pulse" />
          <div className="relative w-full aspect-video rounded-3xl border border-white/10 bg-white/5 animate-pulse" />
        </section>

        {/* Grid Skeletons */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-4 w-24 bg-white/5 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
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
