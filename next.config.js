/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_API_URL: process.env.BACKEND_API_URL || 'http://localhost:4000',
    GOOGLE_FRONTEND_API_KEY: process.env.GOOGLE_FRONTEND_API_KEY || '',
    GOOGLE_MAP_ID: process.env.GOOGLE_MAP_ID || '',
  },
  async rewrites() {
    return [
      {
        source: '/api/get-parcel-hamilton',
        destination: 'http://localhost:4000/api/get-parcel-hamilton',
      },
      {
        source: '/api/get-parcel-marion',
        destination: 'http://localhost:4000/api/get-parcel-marion',
      },
    ];
  },
  reactStrictMode: true,
};

module.exports = nextConfig;

