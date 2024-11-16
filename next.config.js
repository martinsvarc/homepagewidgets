/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
  // Remove serverActions as it's now enabled by default in Next.js 14
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ],
    }
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    return config;
  },
}

module.exports = nextConfig;
