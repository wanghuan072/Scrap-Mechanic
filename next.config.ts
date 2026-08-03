import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [360, 390, 414, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [32, 48, 64, 72, 96, 128, 160, 192, 256, 320],
    qualities: [60, 75],
    minimumCacheTTL: 2678400,
  },
  experimental: {
    inlineCss: true,
  },
};

export default nextConfig;
