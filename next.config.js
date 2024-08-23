const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  // Autres options spécifiques à next-pwa
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  output: 'export',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/nom-du-repo/' : '',
  basePath: '/nom-du-repo',
  trailingSlash: true, // Assure que chaque route se termine par un slash pour GitHub Pages
  images: {
    unoptimized: true, // Les images optimisées par Next.js ne fonctionnent pas avec 'output: export'
  },
};

module.exports = withPWA(nextConfig);
