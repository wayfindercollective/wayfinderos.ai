import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — a stray package-lock.json in the home dir was being
  // inferred as the root, which triggers a build warning.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
