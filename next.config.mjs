/** @type {import('next').NextConfig} */

function getBackendUrl() {
  if (process.env.BACKEND_INTERNAL_URL) return process.env.BACKEND_INTERNAL_URL;
  if (process.env.BACKEND_URL) return process.env.BACKEND_URL;
  // If running locally in development or production without explicit URL, use local NestJS backend
  if (process.env.NODE_ENV !== 'production' || process.env.LOCAL_SERVER === 'true') {
    return 'http://127.0.0.1:4000';
  }
  return 'https://backend-latest-f9da.onrender.com';
}

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
    const backend = getBackendUrl();
    return [
      {
        source: '/api/:path*',
        destination: `${backend}/api/:path*`,
      },
      {
        source: '/school/:schoolSlug/:path*',
        destination: '/:schoolSlug/:path*',
      },
    ];
  },
};

export default nextConfig;
