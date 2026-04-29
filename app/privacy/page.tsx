import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | LyraX",
  description: "Read the LyraX privacy policy to understand how we handle your data, our use of third-party APIs, and our commitment to user security.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="relative z-10 container mx-auto px-4 py-20 max-w-4xl">
      <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-16 shadow-2xl prose prose-invert max-w-none">
        <h1 className="text-3xl font-extrabold tracking-tighter text-white mb-8">Privacy Policy</h1>
        
        <p className="text-zinc-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-6 text-zinc-300">
          <h2 className="text-xl font-bold text-white">1. Introduction</h2>
          <p>
            Welcome to LyraX. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>

          <h2 className="text-xl font-bold text-white">2. Data We Collect</h2>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400">
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data</strong> includes email address and telephone numbers (if provided via our contact form).</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data</strong> includes information about how you use our website.</li>
          </ul>

          <h2 className="text-xl font-bold text-white">3. How We Use Your Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400">
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>

          <h2 className="text-xl font-bold text-white">4. Third-Party Services & APIs</h2>
          <p>
            Our website utilizes third-party APIs (such as The Space Devs API and YouTube iframe embeddings) to deliver real-time space data. These third parties may collect technical data about your interactions with their services embedded on our site. We recommend reviewing their respective privacy policies. We also use Google AdSense, which may use cookies to serve relevant advertisements.
          </p>

          <h2 className="text-xl font-bold text-white">5. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
          </p>

          <h2 className="text-xl font-bold text-white">6. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us via our Contact page.
          </p>
        </section>
      </div>
    </main>
  );
}
