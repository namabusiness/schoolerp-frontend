/** @type {import('next').NextConfig} */
const nextConfig = {
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
        source: '/school/:schoolSlug/:path*',
        destination: '/:schoolSlug/:path*',
      },
    ];
  },
};

export default nextConfig;
