import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
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
