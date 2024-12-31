import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "different-lion-402.convex.cloud", protocol: "https" },
      { hostname: "oceanic-eagle-897.convex.cloud", protocol: "https" },
      { hostname: "img.clerk.com", protocol: "https" },
    ],
  },
};

export default nextConfig;
