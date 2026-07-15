/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['aperia-ds5'],
  allowedDevOrigins: process.env.DEV_ORIGIN ? [process.env.DEV_ORIGIN] : [],
}

export default nextConfig
