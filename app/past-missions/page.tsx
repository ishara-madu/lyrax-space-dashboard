import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getPreviousLaunches } from "@/lib/spaceApi";
import { getLaunchesFromDB } from "@/lib/mongodb";
import { extractYoutubeVideoId, sanitizeSlug } from "@/lib/utils";
import { LaunchCard } from "@/components/LaunchCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Past Space Missions Archive | LyraX",
  description: "Explore our comprehensive archive of past orbital launches, mission outcomes, and historical space telemetry.",
  keywords: ["Space archive", "Past launches", "Mission history", "Rocket history", "Satellite deployments", "Launch success rate"],
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const collectionPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Past Space Missions Archive",
  "description": "A historical record of orbital missions documented by our aerospace analysts.",
  "url": `${baseUrl}/past-missions`,
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": baseUrl
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Mission Archive",
      "item": `${baseUrl}/past-missions`
    }
  ]
};

async function MissionArchiveList() {
  // 1. Fetch documented launches from MongoDB
  const mongoDocs = await getLaunchesFromDB();

  // 2. Fetch enrichment data from API (Top 100 previous)
  const apiPrevious = await getPreviousLaunches(100);
  const apiMap = new Map(apiPrevious.map(l => [l.id, l]));
  
  // 3. Merge logic: prioritize MongoDB records
  const missionsWithApiData = mongoDocs.map(doc => {
    const apiData = apiMap.get(doc.launch_id);
    
    return {
      id: doc.launch_id,
      name: doc.name || apiData?.name || "Unknown Mission",
      net: apiData?.net || doc.net || new Date(0).toISOString(), 
      image: doc.image_url || apiData?.image || apiData?.rocket?.configuration?.image_url || "",
      launch_service_provider: apiData?.launch_service_provider || { name: "Documented Archive" },
      vidURLs: apiData?.vidURLs || [],
      slug: sanitizeSlug(doc.slug),
      status: apiData?.status,
      webcast_live: apiData?.webcast_live
    };
  });

  const now = new Date().getTime();

  const pastMissions = missionsWithApiData
    .filter(m => {
      const missionTime = new Date(m.net).getTime();
      return missionTime > 0 && missionTime < now && m.webcast_live !== true;
    })
    .sort((a, b) => new Date(b.net).getTime() - new Date(a.net).getTime());

  if (pastMissions.length === 0) {
    return (
      <div className="p-16 text-center text-zinc-400 border border-white/10 bg-white/5 rounded-3xl backdrop-blur-xl shadow-2xl">
        <svg className="w-16 h-16 mx-auto mb-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <h3 className="text-2xl font-bold text-white mb-2">Archive Empty</h3>
        <p className="max-w-md mx-auto">
          We found {mongoDocs.length} records in the database, but they didn&apos;t match the criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {pastMissions.map((launch) => {
        const videoId = launch.vidURLs ? extractYoutubeVideoId(launch.vidURLs[0]?.url) : null;
        return (
          <LaunchCard
            key={launch.id}
            id={launch.slug || launch.id}
            missionName={launch.name}
            agency={launch.launch_service_provider?.name || "Unknown"}
            net={launch.net}
            imageUrl={launch.image}
            youtubeVideoId={videoId}
            priority={false}
          />
        );
      })}
    </div>
  );
}

function ArchiveSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="aspect-[4/5] rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
      ))}
    </div>
  );
}

export default function PastMissionsPage() {
  return (
    <main className="relative z-10 container mx-auto px-4 py-16 md:py-20 max-w-7xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[150px]" />
      </div>

      <div className="relative z-10">
        <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500 drop-shadow-sm mb-4">
              Mission Archive
            </h1>
            <p className="text-lg text-zinc-400 font-medium">
              A historical record of orbital missions documented by our aerospace analysts.
            </p>
          </div>
          <Link href="/" className="text-sm font-semibold text-zinc-500 hover:text-white transition-colors flex items-center gap-2 mb-2">
            &larr; Back to Dashboard
          </Link>
        </div>

        <Suspense fallback={<ArchiveSkeleton />}>
          <MissionArchiveList />
        </Suspense>
      </div>
    </main>
  );
}
