import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "LyraX | Space Launch & Satellite Tracker",
    template: "%s | LyraX",
  },
  description:
    "Live telemetry, upcoming rocket launches, and orbital satellite tracking dashboard. Get real-time data on SpaceX, NASA, and global aerospace missions.",
  keywords: [
    "Space tracking",
    "Rocket launches",
    "Live space missions",
    "Telemetry",
    "Satellite tracker",
    "Aerospace",
    "SpaceX",
    "NASA",
    "ISS Tracker",
    "Starlink Tracking",
  ],
  authors: [{ name: "Ishara", url: "https://ishara-madu.github.io/" }],
  creator: "Ishara",
  publisher: "Ishara",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Space Launch & Satellite Tracker",
    description:
      "Live telemetry, upcoming rocket launches, and orbital tracking dashboard.",
    url: baseUrl,
    siteName: "LyraX",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LyraX - Live Rocket & Satellite Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Space Launch & Satellite Tracker",
    description:
      "Live telemetry, upcoming launches, and orbital tracking dashboard.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "/",
  },
};

export const viewport = {
  themeColor: "#030308",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#030308] text-zinc-100">
        <div className="flex-1">{children}</div>

        {/* Global Footer */}
        <footer className="border-t border-white/5 bg-black/50 backdrop-blur-md mt-auto relative z-50">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-zinc-500 text-sm">
                &copy; {new Date().getFullYear()} LyraX. All rights
                reserved.
              </div>
              <div className="flex items-center gap-6 text-sm font-medium text-zinc-400">
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
