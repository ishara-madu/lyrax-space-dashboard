import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | LyraX",
  description: "Review the terms of service for using LyraX, including our data disclaimer and usage licenses for orbital telemetry and launch information.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="relative z-10 container mx-auto px-4 py-20 max-w-4xl">
      <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-16 shadow-2xl prose prose-invert max-w-none">
        <h1 className="text-3xl font-extrabold tracking-tighter text-white mb-8">Terms of Service</h1>
        
        <p className="text-zinc-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-6 text-zinc-300">
          <h2 className="text-xl font-bold text-white">1. Agreement to Terms</h2>
          <p>
            By viewing or using LyraX (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), you agree to be bound by these Terms of Service. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>

          <h2 className="text-xl font-bold text-white">2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on LyraX&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400">
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>attempt to decompile or reverse engineer any software contained on the website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or &quot;mirror&quot; the materials on any other server.</li>
          </ul>

          <h2 className="text-xl font-bold text-white">3. Disclaimer</h2>
          <p>
            The materials on LyraX&apos;s website are provided on an &apos;as is&apos; basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          <p>
            Further, LyraX does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the telemetry, countdowns, orbital positions, or other materials on its website. Real-time data is subject to anomalies and API latency.
          </p>

          <h2 className="text-xl font-bold text-white">4. Limitations</h2>
          <p>
            In no event shall LyraX or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if we have been notified orally or in writing of the possibility of such damage.
          </p>

          <h2 className="text-xl font-bold text-white">5. Links</h2>
          <p>
            LyraX has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us. Use of any such linked website is at the user&apos;s own risk.
          </p>

          <h2 className="text-xl font-bold text-white">6. Modifications</h2>
          <p>
            We may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>
      </div>
    </main>
  );
}
