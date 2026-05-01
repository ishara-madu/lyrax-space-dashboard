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

async function MissionArchiveList({ page }: { page: number }) {
  const limit = 20;
  const offset = (page - 1) * limit;

  // 1. Fetch data safely using Promise.allSettled
  const [mongoRes, apiRes] = await Promise.allSettled([
    getLaunchesFromDB(),
    getPreviousLaunches(limit, offset)
  ]);

  const mongoDocs = mongoRes.status === "fulfilled" ? mongoRes.value : [];
  const apiPrevious = apiRes.status === "fulfilled" ? apiRes.value : [];

  const mongoLaunchMap = new Map(mongoDocs.map(doc => [doc.launch_id, {
    overview_html: doc.overview_html,
    slug: sanitizeSlug(doc.slug),
    name: doc.name,
    image_url: doc.image_url,
    vidURLs: doc.vidURLs
  }]));

  const now = Date.now();

  const pastMissions = apiPrevious
    .filter(launch => {
      const missionTime = new Date(launch.net).getTime();
      return missionTime > 0 && missionTime < now && launch.webcast_live !== true;
    })
    .map(launch => {
      const mongoData = mongoLaunchMap.get(launch.id);
      return {
        ...launch,
        name: mongoData?.name || launch.name,
        slug: mongoData?.slug,
        image: mongoData?.image_url || launch.image || launch.rocket?.configuration?.image_url || "",
        vidURLs: (mongoData?.vidURLs && mongoData.vidURLs.length > 0) ? mongoData.vidURLs : launch.vidURLs,
      };
    });

  if (pastMissions.length === 0) {
    return (
      <div className="p-16 text-center text-zinc-400 border border-white/10 bg-white/5 rounded-3xl backdrop-blur-xl shadow-2xl">
        <svg className="w-16 h-16 mx-auto mb-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <h3 className="text-2xl font-bold text-white mb-2">Archive Empty</h3>
        <p className="max-w-md mx-auto">
          There are currently no past missions on this page, or the API rate limit has been reached. Please check back later.
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

export default async function PastMissionsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
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
          <MissionArchiveList page={page} />
        </Suspense>

        <div className="mt-12 flex items-center justify-center gap-6">
          {page > 1 && (
            <Link
              href={`/past-missions?page=${page - 1}`}
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white font-medium text-sm transition-all duration-300 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.02)]"
            >
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous Page
            </Link>
          )}
          <Link
            href={`/past-missions?page=${page + 1}`}
            className="group flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-500/[0.1] hover:bg-indigo-500/[0.2] border border-indigo-500/20 hover:border-indigo-400/30 text-indigo-300 hover:text-indigo-200 font-medium text-sm transition-all duration-300 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.1)]"
          >
            Next Page
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
