import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse"],
  allowedDevOrigins: ["192.168.1.229"],
};

export default nextConfig;
