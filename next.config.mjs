/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['aperia-ds5'],
  allowedDevOrigins: process.env.DEV_ORIGIN ? [process.env.DEV_ORIGIN] : [],
  // The dev-mode build indicator sits bottom-left and covers the sidebar's user
  // avatar at the same spot, making it look broken while running `next dev`.
  devIndicators: false,
  // Pin the workspace root to this project — a stray lockfile above it (e.g.
  // ~/package-lock.json) otherwise makes Turbopack infer the wrong root.
  turbopack: { root: import.meta.dirname },
  // The panel-principles report is a self-contained static page under public/.
  // Next's static handler serves exact paths only, so /panels needs this to
  // resolve to the directory's index.html.
  async rewrites() {
    return [{ source: "/panels", destination: "/panels/index.html" }]
  },
}

export default nextConfig
