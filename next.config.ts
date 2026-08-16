import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/:locale(ar|en)/playstation',
        destination: '/:locale/category/playstation',
      },
      {
        source: '/:locale(ar|en)/psp',
        destination: '/:locale/category/psp',
      },
      {
        source: '/:locale(ar|en)/xbox',
        destination: '/:locale/category/xbox',
      },
      {
        source: '/:locale(ar|en)/nintendo',
        destination: '/:locale/category/nintendo',
      },
      {
        source: '/:locale(ar|en)/retro-gaming-classics',
        destination: '/:locale/category/retro-gaming-classics',
      },
    ];
  },
};

export default nextConfig;
