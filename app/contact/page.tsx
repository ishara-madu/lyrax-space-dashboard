import React from "react";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://lyrax.live";

export const metadata: Metadata = {
  title: "Contact Us | LyraX Support",
  description: "Get in touch with the LyraX mission control team. We welcome feedback, partnership inquiries, and technical questions about our orbital tracking data.",
  alternates: {
    canonical: "/contact",
  },
};

const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact LyraX",
  description: "Get in touch with the LyraX mission control team for feedback, partnerships, or technical questions.",
  url: `${baseUrl}/contact`,
  publisher: {
    "@type": "Organization",
    name: "LyraX",
    url: baseUrl,
  },
};

export default function ContactPage() {
  return (
    <main className="relative z-10 container mx-auto px-4 py-20 max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
      />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />


      <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12 shadow-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-white mb-3">
            Contact Mission Control
          </h1>
          <p className="text-zinc-400">
            Have a question, feedback, or a partnership inquiry? Transmit your message below.
          </p>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-zinc-300">Full Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-zinc-500 outline-none transition-all"
                placeholder="John Glenn"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-zinc-300">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-zinc-500 outline-none transition-all"
                placeholder="john.glenn@example.com"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-semibold text-zinc-300">Transmission Log (Message)</label>
            <textarea 
              id="message" 
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-zinc-500 outline-none transition-all resize-none"
              placeholder="Enter your message here..."
              required
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 rounded-xl bg-white text-black font-bold tracking-wide hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Initiate Launch Sequence (Send Message)
          </button>
        </form>
      </div>
    </main>
  );
}
