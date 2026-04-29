import React from "react";

export default function LaunchLoading() {
  return (
    <div className="min-h-screen bg-[#030308] text-zinc-100 font-sans">
      <div className="relative z-10 container mx-auto px-4 py-8 md:px-8 space-y-12 max-w-5xl animate-pulse">
        
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-48 bg-white/5 rounded" />

        {/* Hero Card Skeleton */}
        <div className="relative rounded-3xl border border-white/10 bg-white/5 overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto bg-white/5" />
          <div className="w-full md:w-1/2 p-8 space-y-6">
            <div className="h-6 w-24 bg-white/10 rounded-full" />
            <div className="h-12 w-3/4 bg-white/10 rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-white/5 rounded-xl" />
              <div className="h-16 bg-white/5 rounded-xl" />
              <div className="h-16 col-span-2 bg-white/5 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Video Area Skeleton */}
        <div className="space-y-6">
          <div className="h-8 w-64 bg-white/10 rounded" />
          <div className="w-full aspect-video rounded-3xl bg-white/5 border border-white/10" />
        </div>

        {/* Content Area Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-12">
            <div className="h-64 bg-white/5 rounded-3xl border border-white/10" />
            <div className="h-96 bg-white/5 rounded-3xl border border-white/10" />
          </div>
          <div className="lg:col-span-1">
            <div className="h-80 bg-white/5 rounded-3xl border border-white/10" />
          </div>
        </div>

      </div>
    </div>
  );
}
