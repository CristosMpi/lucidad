/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    appDir: true,
  },
  // Disable server-side features for static export
  async rewrites() {
    return [];
  },
  async redirects() {
    return [];
  },
}

module.exports = nextConfig
