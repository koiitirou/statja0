/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/prefecture/category/',
        destination: '/prefecture/',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/statapi1/:path*',
        destination: 'https://storage.googleapis.com/statapi1/:path*',
      },
    ];
  },
};

export default nextConfig;
