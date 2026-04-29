import { LaunchCard } from "@/components/LaunchCard";
import { getUpcomingLaunches, getPreviousLaunches } from "@/lib/spaceApi";
import { getLaunchesFromDB } from "@/lib/mongodb";
import { extractYoutubeVideoId, sanitizeSlug } from "@/lib/utils";

import React from "react";
import MapWrapper from "@/components/MapWrapper";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "LyraX | Real-time Orbital Dashboard | Upcoming Rocket Launches & Satellite Tracker",
  description:
    "Monitor live rocket launches, track satellites in real-time, and explore upcoming space missions with our advanced orbital dashboard. Featuring SpaceX, NASA, and global telemetry.",
  alternates: {
    canonical: "/",
  },
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const creatorPersonJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ishara",
  url: "https://ishara-madu.github.io/",
  sameAs: ["https://github.com/ishara-madu"],
  jobTitle: "Full Stack Developer",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LyraX",
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  sameAs: ["https://github.com/ishara-madu", "https://ishara-madu.github.io/"],
  founder: creatorPersonJsonLd,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "LyraX",
  url: baseUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${baseUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default async function SpaceDashboard(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const videoId =
    typeof searchParams.videoId === "string" ? searchParams.videoId : null;

  // 1. Fetch all data in parallel for maximum performance
  const [mongoDocs, apiUpcoming, apiPrevious] = await Promise.all([
    getLaunchesFromDB(),
    getUpcomingLaunches(50),
    getPreviousLaunches(20),
  ]);

  const mongoLaunchMap = new Map(
    mongoDocs.map((doc) => [
      doc.launch_id,
      { 
        overview_html: doc.overview_html, 
        slug: sanitizeSlug(doc.slug)
      },
    ]),
  );

  const latestPastLaunch = apiPrevious[0] || null;

  // 3. Merge & Process with MongoDB data
  const processLaunch = (launch: any) => ({
    ...launch,
    overview_html: mongoLaunchMap.get(launch.id)?.overview_html,
    slug: mongoLaunchMap.get(launch.id)?.slug,
  });

  const now = new Date();

  // Filter for missions we have documented in MongoDB for SEO/Content
  const upcomingLaunches = apiUpcoming
    .filter((launch) => mongoLaunchMap.has(launch.id))
    .map(processLaunch)
    .filter((l) => new Date(l.net) > now)
    .sort((a, b) => new Date(a.net).getTime() - new Date(b.net).getTime());

  const pastLaunches = apiPrevious
    .filter((launch) => mongoLaunchMap.has(launch.id))
    .map(processLaunch)
    .sort((a, b) => new Date(b.net).getTime() - new Date(a.net).getTime());

  // Find the selected launch for the Hero Section
  let selectedLaunch;
  if (videoId) {
    // Try to find in both pools
    selectedLaunch = [...upcomingLaunches, ...pastLaunches].find((l) =>
      (l.vidURLs || []).some((u: { url: string }) => extractYoutubeVideoId(u.url) === videoId),
    );
  }

  if (!selectedLaunch) {
    // 1. Show currently live launch if available
    const liveLaunch = apiUpcoming.find((l) => l.webcast_live === true);
    if (liveLaunch) {
      selectedLaunch = liveLaunch;
    } else {
      // 2. Fallback to latest post launch (even if not in MongoDB for the Hero)
      selectedLaunch = latestPastLaunch;
    }
  }

  const activeVideoId =
    videoId ||
    (selectedLaunch
      ? extractYoutubeVideoId(selectedLaunch.vidURLs?.[0]?.url)
      : null);
  const isCurrentlyLive = selectedLaunch?.webcast_live === true;

  return (
    <div className="min-h-screen bg-[#030308] text-zinc-100 font-sans selection:bg-indigo-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(creatorPersonJsonLd),
        }}
      />
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 md:px-8 space-y-16 max-w-7xl">
        {/* Section 1: Hero Section (Live Broadcast) */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500 drop-shadow-sm">
              {isCurrentlyLive
                ? "Live Mission Control"
                : "Latest Mission Report"}
            </h1>
            {isCurrentlyLive && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="text-xs font-bold text-red-500 tracking-wider">
                  LIVE
                </span>
              </div>
            )}
          </div>

          <div className="relative w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden group">
            {/* Ambient Border Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative flex flex-col lg:flex-row">
              {/* Video Player Area */}
              <div className="relative w-full lg:w-3/4 aspect-video bg-black/50">
                {activeVideoId ? (
                  <iframe
                    className="absolute inset-0 w-full h-full border-r border-white/10"
                    src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=${isCurrentlyLive ? 1 : 0}&mute=${isCurrentlyLive ? 1 : 0}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    loading="lazy"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center border-r border-white/10 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
                      <div className="z-10 flex flex-col items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-white/50"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <p className="text-zinc-500 font-medium tracking-wide">
                          No live stream available for this mission
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Live Mission Details */}
              <div className="w-full lg:w-1/4 p-6 flex flex-col gap-6 bg-white/[0.02] backdrop-blur-3xl">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {selectedLaunch ? selectedLaunch.name : "Mission Pending"}
                  </h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {selectedLaunch?.launch_service_provider?.name ||
                      "Unknown Agency"}
                  </p>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-xs text-zinc-500 uppercase font-semibold mb-1">
                      Target NET
                    </div>
                    <div className="text-sm font-mono text-zinc-200">
                      {selectedLaunch
                        ? new Date(selectedLaunch.net).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                        : "TBD"}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-xs text-zinc-500 uppercase font-semibold mb-1">
                      Mission Status
                    </div>
                    <div
                      className={`text-lg font-mono ${isCurrentlyLive ? "text-emerald-400" : "text-blue-400"}`}
                    >
                      {selectedLaunch?.status?.name ||
                        (isCurrentlyLive
                          ? "LIVE IN FLIGHT"
                          : "Post-Launch / Awaiting")}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-xs text-zinc-500 uppercase font-semibold mb-1">
                      Target Orbit
                    </div>
                    <div className="text-sm font-mono text-zinc-200 text-indigo-300">
                      {selectedLaunch?.mission?.orbit?.name ||
                        "Suborbital / TBD"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Upcoming Launches Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
              Upcoming Launches
            </h2>
            <Link
              href="/schedule"
              className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All Schedule &rarr;
            </Link>
          </div>

          {upcomingLaunches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingLaunches.slice(0, 4).map((launch, index) => {
                const videoId = launch.vidURLs
                  ? extractYoutubeVideoId(launch.vidURLs[0]?.url)
                  : null;
                return (
                  <LaunchCard
                    key={launch.id}
                    id={launch.slug || launch.id}
                    missionName={launch.name}
                    agency={launch.launch_service_provider?.name || "Unknown"}
                    net={launch.net}
                    imageUrl={
                      launch.image ||
                      launch.rocket?.configuration?.image_url ||
                      launch.infographic ||
                      ""
                    }
                    youtubeVideoId={videoId}
                    priority={index < 4}
                  />
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-400 border border-white/10 bg-white/5 rounded-2xl backdrop-blur-md">
              No upcoming documented launches found.
            </div>
          )}
        </section>

        {/* Section 2.5: Recent Missions (Past) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
              Recent Missions
            </h2>
            <Link
              href="/past-missions"
              className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All Past Missions &rarr;
            </Link>
          </div>

          {pastLaunches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pastLaunches.slice(0, 4).map((launch) => {
                const videoId = launch.vidURLs
                  ? extractYoutubeVideoId(launch.vidURLs[0]?.url)
                  : null;
                return (
                  <LaunchCard
                    key={launch.id}
                    id={launch.slug || launch.id}
                    missionName={launch.name}
                    agency={launch.launch_service_provider?.name || "Unknown"}
                    net={launch.net}
                    imageUrl={
                      launch.image ||
                      launch.rocket?.configuration?.image_url ||
                      launch.infographic ||
                      ""
                    }
                    youtubeVideoId={videoId}
                    priority={false}
                  />
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-400 border border-white/10 bg-white/5 rounded-2xl backdrop-blur-md">
              No recent missions found in our records.
            </div>
          )}
        </section>

        {/* Section 3: Live Satellite Map Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            Live Orbital Tracker (ISS)
          </h2>
          <div className="relative w-full h-[500px]">
            <MapWrapper />
          </div>
        </section>

        {/* Section 4: SEO & AdSense Content Area */}
        <section className="pt-12 pb-24 mt-16 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-zinc-200 mb-8 px-2">
              Mission Analysis Highlights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...upcomingLaunches, ...pastLaunches]
                .slice(0, 2)
                .map((launch) => (
                  <div
                    key={launch.id}
                    className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col h-full hover:bg-white/[0.04] transition-colors duration-300 group"
                  >
                    <h3 className="text-xl font-bold text-zinc-100 mb-3 line-clamp-1">
                      {launch.name}
                    </h3>
                    <div className="relative flex-1 mb-6">
                      {launch.overview_html ? (
                        <div
                          className="prose prose-invert prose-sm max-w-none prose-p:text-zinc-400 prose-headings:hidden line-clamp-6 text-ellipsis overflow-hidden"
                          dangerouslySetInnerHTML={{
                            __html: launch.overview_html,
                          }}
                        />
                      ) : (
                        <p className="text-zinc-500 italic text-sm leading-relaxed line-clamp-6 text-ellipsis overflow-hidden">
                          Mission briefing under editorial review. Our aerospace
                          analysts are currently compiling the latest telemetry,
                          payload specifications, and strategic data.
                        </p>
                      )}
                      {/* Gradient Fade to hide hard cutoffs */}
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#030308] group-hover:from-[#05050b] transition-colors duration-300 to-transparent pointer-events-none" />
                    </div>

                    <Link
                      href={`/launch/${launch.slug || launch.id}`}
                      className="mt-auto self-start text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5"
                    >
                      Read Full Analysis
                      <svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
