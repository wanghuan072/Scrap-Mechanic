import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/quests",
        destination: "/wiki/quests",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/legal/privacy-policy",
        permanent: true,
      },
      {
        source: "/terms-of-use",
        destination: "/legal/terms-of-service",
        permanent: true,
      },
      {
        source: "/copyright",
        destination: "/legal/copyright",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/legal/about-us",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/legal/contact-us",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
