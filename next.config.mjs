/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['https://barelryics.vercel.app/logo.png'],
    unoptimized: true,
  },
  async rewrites() {
    return [
      // Admin subdomain rewrites
      {
        source: '/admin/:path*',
        destination: '/admin/:path*',
        has: [
          {
            type: 'host',
            value: 'admin.barelyrics.vercel.app',
          },
        ],
      },
    ]
  },
}

export default nextConfig
