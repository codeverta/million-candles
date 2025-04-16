/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  staticPageGenerationTimeout: 120,
  typescript: {
    // Ignore TypeScript errors during production builds
    ignoreBuildErrors: true,
  },
  i18n: {
    locales: ["en", "id"],
    defaultLocale: "en",
    localeDetection: true, // Optional
  },
};

module.exports = nextConfig;
