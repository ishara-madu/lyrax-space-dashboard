import { getLaunchById } from "@/lib/spaceApi";
import { getLaunchesFromDB } from "@/lib/mongodb";
import { extractYoutubeVideoId } from "@/lib/utils";
import { FallbackImage } from "@/components/FallbackImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const articleData = await getArticleFromDB(resolvedParams.slug);
  if (!articleData?.launch_id) return { title: "Launch Not Found" };
  
  const launch = await getLaunchById(articleData.launch_id);

  if (!launch) {
    return {
      title: "Launch Not Found",
    };
  }

  // Extract a clean snippet from overview_html if available, fallback to basic description
  let descriptionSnippet = launch.mission?.description || "Live coverage and analysis of this space mission.";
  if (articleData?.overview_html) {
    // Strip HTML tags for clean description
    const stripped = articleData.overview_html.replace(/<[^>]+>/g, '');
    descriptionSnippet = stripped.substring(0, 160) + (stripped.length > 160 ? "..." : "");
  }

  const imageUrl = launch.image || launch.rocket?.configuration?.image_url || launch.infographic || "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=2070&auto=format&fit=crop";

  return {
    title: launch.name,
    description: descriptionSnippet,
    alternates: {
      canonical: `/launch/${resolvedParams.slug}`,
    },
    openGraph: {
      title: launch.name,
      description: descriptionSnippet,
      images: [imageUrl],
      url: `${baseUrl}/launch/${resolvedParams.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: launch.name,
      description: descriptionSnippet,
      images: [imageUrl],
    },
  };
}

const getArticleFromDB = React.cache(async (slug: string) => {
  try {
    const mongoDocs = await getLaunchesFromDB();
    const article = mongoDocs.find(doc => doc.slug === slug || doc.launch_id === slug);
    return article ? {
      overview_html: article.overview_html,
      analysis_html: article.analysis_html,
      launch_id: article.launch_id,
      created_at: article.created_at || null,
      updated_at: article.updated_at || null,
    } : null;
  } catch (error) {
    console.error("Failed to fetch article from MongoDB:", error);
    return null;
  }
});


export default async function LaunchDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params since this is Next.js 15
  const resolvedParams = await params;
  
  const articleData = await getArticleFromDB(resolvedParams.slug);
  
  if (!articleData?.launch_id) {
    notFound();
  }

  const launch = await getLaunchById(articleData.launch_id);

  if (!launch) {
    notFound();
  }

  const activeVideoId = extractYoutubeVideoId(launch.vidURLs?.[0]?.url);

  const launchTime = new Date(launch.net).getTime();
  const now = new Date().getTime();
  const isTooEarly = launchTime - now > 60 * 60 * 1000;
  const isWebcastLive = launch.webcast_live === true;

  const imageUrl = launch.image || launch.rocket?.configuration?.image_url || launch.infographic || "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=2070&auto=format&fit=crop";

  const canonicalUrl = `${baseUrl}/launch/${resolvedParams.slug}`;

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: launch.name,
    startDate: launch.net,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: launch.status?.name?.toLowerCase().includes("success") 
      ? "https://schema.org/EventScheduled" 
      : "https://schema.org/EventScheduled",
    location: {
      "@type": "VirtualLocation",
      url: canonicalUrl
    },
    image: [imageUrl],
    description: launch.mission?.description || launch.name,
    organizer: {
      "@type": "Organization",
      name: launch.launch_service_provider?.name || "Space Agency",
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Launches",
        item: `${baseUrl}/schedule`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: launch.name,
        item: canonicalUrl
      }
    ]
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: launch.name,
    image: [imageUrl],
    url: canonicalUrl,
    datePublished: articleData?.created_at ? new Date(articleData.created_at).toISOString() : launch.net,
    dateModified: articleData?.updated_at ? new Date(articleData.updated_at).toISOString() : new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "LyraX",
      url: baseUrl
    },
    publisher: {
      "@type": "Organization",
      name: "LyraX",
      url: baseUrl
    },
    description: launch.mission?.description || launch.name,
  };

  return (
    <main className="min-h-screen bg-[#030308] text-zinc-100 font-sans selection:bg-indigo-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-indigo-600/5 blur-[150px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:px-8 space-y-12 max-w-5xl">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-zinc-400 font-medium">
          <Link href="/" className="hover:text-white transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-zinc-200 truncate max-w-[200px] sm:max-w-none">{launch.name}</span>
        </nav>

        {/* Hero Details Section */}
        <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 relative aspect-[4/3] md:aspect-auto bg-zinc-900">
            <FallbackImage
              src={launch.image || launch.rocket?.configuration?.image_url || launch.infographic || (activeVideoId ? `https://img.youtube.com/vi/${activeVideoId}/hqdefault.jpg` : "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=2070&auto=format&fit=crop")}
              fallbackSrc={activeVideoId ? `https://img.youtube.com/vi/${activeVideoId}/hqdefault.jpg` : "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=2070&auto=format&fit=crop"}
              alt={launch.name}
              fill
              unoptimized
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030308] via-transparent to-transparent opacity-80 md:hidden" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#030308] hidden md:block" />
          </div>

          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center gap-6">
            <div>
              <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase">
                {launch.launch_service_provider?.name || "Unknown Agency"}
              </span>
              <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tighter text-white drop-shadow-sm leading-tight">
                {launch.name}
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-xs text-zinc-500 uppercase font-semibold mb-1">Target NET</div>
                <div className="text-sm font-mono text-zinc-200">
                  {new Date(launch.net).toLocaleString()}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-xs text-zinc-500 uppercase font-semibold mb-1">Launch Site</div>
                <div className="text-sm font-medium text-zinc-200 truncate">
                  {launch.pad?.name || "TBA"}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 col-span-2">
                <div className="text-xs text-zinc-500 uppercase font-semibold mb-1">Rocket Configuration</div>
                <div className="text-sm font-medium text-zinc-200">
                  {launch.rocket?.configuration?.full_name || launch.rocket?.configuration?.name || "Vehicle TBA"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Stream Section */}
        {activeVideoId && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-3">
              {isWebcastLive && (
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              )}
              {!isTooEarly ? "Live Mission Coverage" : "Mission Broadcast Area"}
            </h2>
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              {isTooEarly && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md">
                  <div className="bg-black/60 px-6 py-3 rounded-xl border border-white/10 mb-3 shadow-xl">
                    <span className="text-white font-bold tracking-wider">Awaiting Official Live Stream</span>
                  </div>
                  <p className="text-zinc-300 text-sm font-medium max-w-md text-center">
                    Launch is more than 1 hour away. Video may show a previous scrubbed attempt or holding screen.
                  </p>
                </div>
              )}
              <iframe 
                className={`w-full h-full bg-black ${isTooEarly ? 'opacity-50' : 'opacity-100'}`}
                src={`https://www.youtube.com/embed/${activeVideoId}`} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                loading="lazy"
                allowFullScreen>
              </iframe>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-12">
            {/* Detailed Mission Information */}
            <section className="bg-white/[0.02] border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-100 mb-6">Mission Overview</h2>
              {articleData?.overview_html ? (
                <div 
                  className="prose prose-invert max-w-none text-gray-300"
                  dangerouslySetInnerHTML={{ __html: articleData.overview_html }}
                />
              ) : (
                <p className="text-zinc-400 italic leading-relaxed text-lg">
                  Our aerospace analysts are currently compiling the latest telemetry, payload specifications, and strategic data. The comprehensive flight report will be published shortly.
                </p>
              )}
            </section>

            {/* SEO Content: Mission Analysis from MongoDB */}
            <section className="pt-8 border-t border-white/5">
              <div className="space-y-8 text-zinc-400 leading-relaxed">
                <h2 className="text-3xl font-extrabold text-zinc-100">Mission Details & Analysis</h2>
                
                {articleData?.analysis_html ? (
                  <div 
                    className="prose prose-invert max-w-none text-gray-300"
                    dangerouslySetInnerHTML={{ __html: articleData.analysis_html }}
                  />
                ) : (
                  <div className="p-12 text-center border border-white/10 bg-white/5 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-blue-500/10 opacity-50" />
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-blue-400 animate-spin" />
                      <h3 className="text-xl font-bold text-white tracking-wide">Mission Briefing Under Editorial Review</h3>
                      <p className="text-zinc-400 max-w-md mx-auto text-sm">
                        Our aerospace analysts are currently compiling the latest telemetry, payload specifications, and strategic data. The comprehensive flight report will be published shortly. Please check back soon.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Quick Facts Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl flex flex-col gap-6">
              <h3 className="text-lg font-extrabold tracking-tight text-white border-b border-white/10 pb-4">Quick Facts</h3>
              
              <div className="space-y-5">
                <div>
                  <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Launch Provider</div>
                  <div className="text-sm font-semibold text-zinc-200">{launch.launch_service_provider?.name || "Unknown"}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Vehicle</div>
                  <div className="text-sm font-semibold text-zinc-200">{launch.rocket?.configuration?.full_name || launch.rocket?.configuration?.name || "Unknown"}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Launch Site</div>
                  <div className="text-sm font-semibold text-zinc-200">{launch.pad?.name || "TBA"}</div>
                </div>
                {launch.mission?.orbit?.name && (
                  <div>
                    <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Target Orbit</div>
                    <div className="text-sm font-semibold text-zinc-200">{launch.mission.orbit.name}</div>
                  </div>
                )}
                {launch.mission?.type && (
                  <div>
                    <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Payload Type</div>
                    <div className="text-sm font-semibold text-zinc-200">{launch.mission.type}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Status</div>
                  <div className="text-sm font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">{launch.status?.name || "Unknown"}</div>
                </div>
              </div>
            </div>
          </aside>
        </div>

      </div>
    </main>
  );
}
