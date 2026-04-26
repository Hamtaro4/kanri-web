import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/kanri-web',
  images: { unoptimized: true },
};

export default nextConfig;
