import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sdwanylcysmixxlawfqe.supabase.co",
      },
    ],
  },
};

export default nextConfig;
