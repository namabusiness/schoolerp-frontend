/** @type {import('next').NextConfig} */
const backendUrl =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.BACKEND_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000'
    : 'https://backend-latest-f9da.onrender.com');

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/school/:schoolSlug/:path*',
        destination: '/:schoolSlug/:path*',
      },
    ];
  },
};

export default nextConfig;
