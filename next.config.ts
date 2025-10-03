import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "placehold.co",
        protocol: "https",
        port: "",
        pathname: "**"
      }
    ]
  }
};

export default nextConfig;
