import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/digest", destination: "/trend", permanent: true },
      { source: "/digest/:date", destination: "/trend/:date", permanent: true },
    ];
  },
};

export default nextConfig;
