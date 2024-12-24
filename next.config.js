/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_API_URL: 'holycrapcleaners-backend:4000',
    GOOGLE_FRONTEND_API_KEY: 'AIzaSyCkuHukQf5cyI5Oz8uLvY0uhX1nYzH4cWQ', // Replace with your Frontend API Key
  },
  compiler: {
    // Enable performance optimizations if needed
    styledComponents: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://holycrapcleaners-backend.onrender.com/api/:path*',
      },
    ];
  },
};


module.exports = nextConfig;

