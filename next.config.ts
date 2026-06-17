import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.255.76.195"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      {
        protocol: "https",
        hostname: "thespacedevs-prod.nyc3.digitaloceanspaces.com",
        pathname: "/media/images/**",
      },
    ],
  },
};

export default nextConfig;
