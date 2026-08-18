import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    cpus: 1,
  },
  async redirects() {
    return [
      {
        source: '/:locale(ar|en)/category/gaming-pcs',
        destination: '/:locale/products?category=pc&subCategory=gaming-pcs',
        permanent: true,
      },
      {
        source: '/:locale(ar|en)/category/pc-components',
        destination: '/:locale/products?category=pc',
        permanent: true,
      },
      {
        source: '/:locale(ar|en)/category/gaming',
        destination: '/:locale/products?category=consoles-accessories',
        permanent: true,
      },
      {
        source: '/:locale(ar|en)/category/retro-gaming-classics',
        destination: '/:locale/products?category=retro-games',
        permanent: true,
      },
      {
        source: '/:locale(ar|en)/category/retro-gaming',
        destination: '/:locale/products?category=retro-games',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/:locale(ar|en)/playstation',
        destination: '/:locale/products?category=playstation',
      },
      {
        source: '/:locale(ar|en)/psp',
        destination: '/:locale/products?category=playstation&subCategory=psp',
      },
      {
        source: '/:locale(ar|en)/xbox',
        destination: '/:locale/products?category=xbox',
      },
      {
        source: '/:locale(ar|en)/nintendo',
        destination: '/:locale/products?category=nintendo',
      },
      {
        source: '/:locale(ar|en)/retro-gaming-classics',
        destination: '/:locale/products?category=retro-games',
      },
    ];
  },
};

export default nextConfig;
