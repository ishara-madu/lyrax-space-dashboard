import React from "react";

export function CardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 flex flex-col h-full animate-pulse">
      {/* Image Area */}
      <div className="relative aspect-video w-full bg-white/5 shrink-0" />
      
      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1 space-y-4">
        {/* Agency Tag */}
        <div className="h-4 w-20 bg-white/10 rounded-full" />
        
        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 w-full bg-white/10 rounded" />
          <div className="h-5 w-2/3 bg-white/10 rounded" />
        </div>
        
        {/* Bottom Section */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-white/20" />
            <div className="h-4 w-24 bg-white/10 rounded" />
          </div>
          <div className="h-8 w-24 bg-white/10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
