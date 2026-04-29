import { getLaunchById } from "@/lib/spaceApi";
import { getLaunchesFromDB } from "@/lib/mongodb";
import { extractYoutubeVideoId, sanitizeSlug } from "@/lib/utils";
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
    keywords: articleData?.primary_keyword ? [articleData.primary_keyword] : undefined,
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
    const article = mongoDocs.find(doc => {
      const cleanSlug = sanitizeSlug(doc.slug);
      return cleanSlug === slug || doc.launch_id === slug;
    });
    return article ? {
      overview_html: article.overview_html,
      analysis_html: article.analysis_html,
      launch_id: article.launch_id,
      primary_keyword: article.primary_keyword || null,
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
          <div className="lg:col-span-3">
            <div className="relative pl-8 md:pl-12 space-y-12 before:absolute before:left-[11px] md:before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-indigo-500 before:via-blue-500/20 before:to-transparent">
              
              {/* Mission Overview Entry */}
              <section className="relative group">
                <div className="absolute left-[-41px] md:left-[-53px] top-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#030308] border-2 border-indigo-500 z-10 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-shadow duration-300">
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-indigo-400 animate-pulse" />
                </div>
                
                <div className="relative p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl transition-all duration-300 group-hover:border-white/20">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xs font-bold tracking-[0.2em] text-indigo-400 uppercase opacity-70">Entry 01</span>
                    <h2 className="text-xl md:text-2xl font-black tracking-tighter text-zinc-100 uppercase italic">Mission Overview</h2>
                  </div>
                  
                  {articleData?.overview_html ? (
                    <div 
                      className="prose prose-invert max-w-none text-zinc-300/90 leading-[1.8] text-base md:text-lg font-medium selection:bg-indigo-500/30"
                      dangerouslySetInnerHTML={{ __html: articleData.overview_html }}
                    />
                  ) : (
                    <p className="text-zinc-400 italic leading-[1.8] text-lg font-medium">
                      Our aerospace analysts are currently compiling the latest telemetry, payload specifications, and strategic data. The comprehensive flight report will be published shortly.
                    </p>
                  )}
                </div>
              </section>

              {/* Mission Details & Analysis Entry */}
              <section className="relative group">
                <div className="absolute left-[-41px] md:left-[-53px] top-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#030308] border-2 border-blue-500 z-10 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-shadow duration-300">
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-blue-400" />
                </div>

                <div className="relative p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl transition-all duration-300 group-hover:border-white/20">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase opacity-70">Entry 02</span>
                    <h2 className="text-xl md:text-2xl font-black tracking-tighter text-zinc-100 uppercase italic">Detailed Analysis</h2>
                  </div>
                  
                  {articleData?.analysis_html ? (
                    <div 
                      className="prose prose-invert max-w-none text-zinc-300/90 leading-[1.8] text-base md:text-lg font-medium selection:bg-blue-500/30"
                      dangerouslySetInnerHTML={{ __html: articleData.analysis_html }}
                    />
                  ) : (
                    <div className="p-8 md:p-12 text-center rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden">
                      <div className="relative z-10 flex flex-col items-center gap-4">
                        <div className="w-10 h-10 rounded-full border-t-2 border-r-2 border-blue-400 animate-spin" />
                        <h3 className="text-lg font-bold text-white tracking-wide uppercase italic">Decrypting Data Stream...</h3>
                        <p className="text-zinc-500 max-w-md mx-auto text-sm leading-relaxed">
                          Final telemetry validation in progress. The detailed mission logs and strategic insights are being processed by our orbital analysts.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
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
