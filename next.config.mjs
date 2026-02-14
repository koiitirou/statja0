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
};

export default nextConfig;
