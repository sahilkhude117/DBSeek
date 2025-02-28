import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.ctfassets.net"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
