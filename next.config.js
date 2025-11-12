/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  env: {
    SITE_URL: process.env.SITE_URL || 'http://localhost:3000',
  },
}

module.exports = nextConfig

