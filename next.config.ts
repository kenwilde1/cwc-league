import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['blob.vercel-storage.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
