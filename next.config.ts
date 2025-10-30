import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "placehold.co",
        protocol: "https",
        port: "",
        pathname: "**"
      },
      {
        hostname: "res.cloudinary.com",
        protocol: "http",
        port: "",
        pathname: "**"
      },
      {
        hostname: "res.cloudinary.com",
        protocol: "https",
        port: "",
        pathname: "**"
      },
    ]
  }
};

export default nextConfig;
