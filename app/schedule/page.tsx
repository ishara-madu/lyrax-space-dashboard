import React from "react";
import type { Metadata } from "next";
import { getUpcomingLaunches } from "@/lib/spaceApi";
import { getLaunchesFromDB } from "@/lib/mongodb";
import { extractYoutubeVideoId, sanitizeSlug } from "@/lib/utils";
import { LaunchCard } from "@/components/LaunchCard";

export const metadata: Metadata = {
  title: "Full Rocket Launch Schedule | Upcoming Orbital Missions",
  description: "Stay updated with the complete schedule of all upcoming global rocket launches. Tracking SpaceX, NASA, Rocket Lab, and more missions in real-time.",
  keywords: ["Launch schedule", "Rocket launches", "SpaceX schedule", "NASA missions", "Space flight tracker"],
  alternates: {
    canonical: "/schedule",
  },
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const collectionPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Upcoming Rocket Launch Schedule",
  "description": "Complete schedule of all upcoming global orbital launches, including SpaceX, NASA, and international space agencies.",
  "url": `${baseUrl}/schedule`,
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
      "name": "Launch Schedule",
      "item": `${baseUrl}/schedule`
    }
  ]
};

export default async function SchedulePage() {
  // 1. Fetch from MongoDB
  const mongoDocs = await getLaunchesFromDB();
  const mongoLaunchMap = new Map(mongoDocs.map(doc => [doc.launch_id, { 
    overview_html: doc.overview_html, 
    slug: sanitizeSlug(doc.slug),
    name: doc.name
  }]));

  // 2. Fetch from The Space Devs API
  const allLaunches = await getUpcomingLaunches(50);
  
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  // Ensure strict time-filtering logic so no past launches appear,
  // AND ensure they exist in our MongoDB database.
  const upcomingLaunches = allLaunches
    .filter(launch => {
      const isFuture = new Date(launch.net).getTime() > now;
      const isLive = launch.webcast_live === true;
      const existsInMongo = mongoLaunchMap.has(launch.id);
      return (isFuture || isLive) && existsInMongo;
    })
    .map(launch => {
      const mongoData = mongoLaunchMap.get(launch.id);
      return {
        ...launch,
        name: mongoData?.name || launch.name,
        slug: mongoData?.slug
      };
    });

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
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[150px]" />
      </div>

      <div className="relative z-10">
        <div className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500 drop-shadow-sm mb-4">
            Full Launch Schedule
          </h1>
          <p className="text-lg text-zinc-400 font-medium max-w-2xl">
            A comprehensive, real-time index of all upcoming orbital missions, vehicle tests, and satellite deployments across the globe.
          </p>
        </div>

        {upcomingLaunches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {upcomingLaunches.map((launch, index) => {
              const videoId = launch.vidURLs ? extractYoutubeVideoId(launch.vidURLs[0]?.url) : null;
              return (
                <LaunchCard
                  key={launch.id}
                  id={launch.slug || launch.id}
                  missionName={launch.name}
                  agency={launch.launch_service_provider?.name || "Unknown"}
                  net={launch.net}
                  imageUrl={launch.image || launch.rocket?.configuration?.image_url || launch.infographic || ""}
                  youtubeVideoId={videoId}
                  priority={index < 4}
                />
              );
            })}
          </div>
        ) : (
          <div className="p-16 text-center text-zinc-400 border border-white/10 bg-white/5 rounded-3xl backdrop-blur-xl shadow-2xl">
            <svg className="w-16 h-16 mx-auto mb-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-bold text-white mb-2">No Upcoming Launches</h3>
            <p className="max-w-md mx-auto">
              There are currently no scheduled launches in the immediate future, or the API rate limit has been reached. Please check back later.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
