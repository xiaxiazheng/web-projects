import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  basePath: "/m",
  transpilePackages: ['@xiaxiazheng/blog-libs'],
};

export default nextConfig;
