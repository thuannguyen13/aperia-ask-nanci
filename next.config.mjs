/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['aperia-ds5'],
  allowedDevOrigins: process.env.DEV_ORIGIN ? [process.env.DEV_ORIGIN] : [],
  // Pin the workspace root to this project — a stray lockfile above it (e.g.
  // ~/package-lock.json) otherwise makes Turbopack infer the wrong root.
  turbopack: { root: import.meta.dirname },
}

export default nextConfig
