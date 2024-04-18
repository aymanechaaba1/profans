/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // …
    // serverComponentsExternalPackages: ['react-dom/server'],
  },
  images: {
    remotePatterns: [
      {
        hostname: 'flagcdn.com',
      },
      {
        hostname: 'upload.wikimedia.org',
      },
      {
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
};

export default nextConfig;
