import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow Supabase storage hostname used for public images
    domains: ['sdwanylcysmixxlawfqe.supabase.co'],
  },
};

export default nextConfig;
