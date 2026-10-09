import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 验证构建可隔离目录，避免影响用户正在运行的开发服务。
  distDir: process.env.NEXT_BUILD_DIR || ".next",
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
      {
        source: "/map-assets/generated/reference-overview-:hash.webp",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
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
