import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      fs: { browser: "./src/features/native-map/vendor/empty-node-module.ts" },
      path: { browser: "./src/features/native-map/vendor/empty-node-module.ts" },
    },
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: "/map-assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
          },
        ],
      },
    ];
  },
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
