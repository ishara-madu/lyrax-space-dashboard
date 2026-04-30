import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | LyraX",
  description: "Learn about our team of space enthusiasts providing real-time orbital telemetry, mission tracking, and launch coverage for space fans worldwide.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const stats = [
    { value: "10+", label: "Live Launches Tracked" },
    { value: "2", label: "Satellites on Map" },
    { value: "15 min", label: "Data Refresh Rate" },
    { value: "24 / 7", label: "Mission Coverage" },
  ];

  return (
    <main className="relative z-10 min-h-[calc(100vh-5rem)]">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-600/8 blur-[140px]" />
      </div>

      <div className="container relative mx-auto max-w-4xl px-4 py-20">

        {/* Hero */}
        <div className="mb-14 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300">
            Our Mission
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tighter text-white md:text-5xl">
            Built by Space Enthusiasts,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              for Space Enthusiasts
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            We are a dedicated team of aerospace fans, data engineers, and designers united by one goal:
            making the wonders of space exploration accessible to everyone on Earth in real time.
          </p>
        </div>

        {/* Stats strip */}
        <div className="mb-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-md">
              <div className="text-2xl font-extrabold text-white">{value}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-12">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">Who We Are</h2>
            <p className="leading-relaxed text-zinc-300">
              LyraX was born from a simple frustration: existing space-tracking tools were either
              too technical for casual enthusiasts or too shallow for serious hobbyists. We set out to build
              a dashboard that bridges both worlds — beautiful enough for first-time visitors, powerful
              enough for orbital mechanics nerds.
            </p>
          </section>

          <div className="border-t border-white/5" />

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">What We Track</h2>
            <p className="leading-relaxed text-zinc-300">
              Leveraging the public APIs from{" "}
              <a href="https://thespacedevs.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                The Space Devs (Launch Library 2)
              </a>
              , we surface the top 10 upcoming rocket launches with real-time countdowns, mission
              descriptions, and live-stream integration. Our orbital map uses TLE data to plot the
              International Space Station and the Hubble Space Telescope with second-level precision.
            </p>
          </section>

          <div className="border-t border-white/5" />

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">Our Commitment</h2>
            <p className="leading-relaxed text-zinc-300">
              All data displayed on this platform is sourced from publicly available APIs and updated
              continuously. We are committed to accuracy, transparency, and an experience that keeps
              every visitor — whether an industry professional, student, or curious bystander — glued
              to their screen as humanity pushes deeper into the cosmos. Keep looking up.
            </p>
          </section>
        </div>

      </div>
    </main>
  );
}
