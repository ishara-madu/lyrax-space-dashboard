"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface LaunchCardProps {
  id: string;
  missionName: string;
  agency: string;
  net: string;
  imageUrl: string;
  youtubeVideoId?: string | null;
  priority?: boolean;
}

export function LaunchCard({
  id,
  missionName,
  agency,
  net,
  imageUrl,
  youtubeVideoId,
  priority = false,
}: LaunchCardProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState<string>("Calculating...");

  useEffect(() => {
    const launchDate = new Date(net).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance < 0) {
        setCountdown("Launched");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const formatted = `T-Minus ${days > 0 ? `${days}d ` : ""}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      setCountdown(formatted);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [net]);

  const [imgError, setImgError] = useState(false);
  const fallbackImg = youtubeVideoId 
    ? `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg` 
    : "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=2070&auto=format&fit=crop";
    
  const currentImg = imgError ? fallbackImg : (imageUrl || fallbackImg);

  return (
    <Link href={`/launch/${id}`} className="block h-full group" aria-label={`View details for ${missionName}`}>
      <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/10 group-hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.15)] flex flex-col h-full">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative aspect-video w-full overflow-hidden shrink-0 bg-zinc-900">
        <Image
          src={currentImg}
          alt={missionName}
          fill
          priority={priority}
          onError={() => setImgError(true)}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        {/* Countdown Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium tracking-wider text-white/70 uppercase">
              Countdown
            </span>
            <span className="font-mono text-xl font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
              {countdown}
            </span>
          </div>
        </div>
      </div>

      <div className="relative p-5 flex flex-col flex-1">
        <div className="mb-1 flex items-center justify-between">
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-white/80 line-clamp-1">
            {agency}
          </span>
        </div>
        <h3 className="mt-2 text-lg font-bold tracking-tight text-white line-clamp-2">
          {missionName}
        </h3>
        
        <div className="mt-auto pt-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {countdown === "Launched" ? (
              <>
                <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                <span className="text-sm font-medium text-blue-400">Post-Launch</span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
                <span className="text-sm font-medium text-emerald-400">Scheduled</span>
              </>
            )}
          </div>
          
          {youtubeVideoId && (
            <div
              className={`relative z-20 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:text-white ${
                countdown === "Launched"
                  ? "bg-zinc-500/10 border-zinc-500/30 text-zinc-400 hover:bg-zinc-500 hover:shadow-[0_0_15px_rgba(161,161,170,0.4)]"
                  : "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              }`}
              onClick={(e) => {
                e.preventDefault(); 
                e.stopPropagation();
                window.scrollTo({ top: 0, behavior: "smooth" });
                router.push(`/?videoId=${youtubeVideoId}`, { scroll: false });
              }}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              {countdown === "Launched" ? "Watch Replay" : "Watch Live"}
            </div>
          )}
          </div>
        </div>
      </article>
    </Link>
  );
}
