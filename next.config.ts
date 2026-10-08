import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  images: { remotePatterns: [{ protocol: 'https', hostname: 'images.pexels.com', pathname: '/photos/**' }] },
};

export default nextConfig;
