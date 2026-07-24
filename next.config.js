/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  /* config options here */
  outputFileTracingRoot: path.join(__dirname),
  serverExternalPackages: ['@genkit-ai/google-genai', 'google-auth-library', 'genkit', 'jws', 'googleapis'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
