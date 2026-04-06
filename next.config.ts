import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/aida-public/**',
      },
      {
        protocol: 'https',
        hostname: 'banco.santander.cl',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'maps.gstatic.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
