const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  staticPageGenerationTimeout: 120,
  typescript: {
    // Ignore TypeScript errors during production builds
    ignoreBuildErrors: true,
  },
  i18n,
  images: {
    domains: [
      "picsum.photos",
      "firebasestorage.googleapis.com",
      "cdn.dribbble.com",
    ],
  },
};

module.exports = nextConfig;
