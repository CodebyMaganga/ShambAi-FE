/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async rewrites() {
    return [
      {
        source: '/api/dashboard/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/dashboard/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
