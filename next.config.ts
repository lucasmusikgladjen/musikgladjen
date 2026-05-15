import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/ansok",
        destination: "/jobb/ansok",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
