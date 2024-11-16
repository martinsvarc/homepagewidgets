/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        }
      ]
    }
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname)
    }
    return config;
  }
}

module.exports = nextConfig;
