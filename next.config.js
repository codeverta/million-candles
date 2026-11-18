const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  staticPageGenerationTimeout: 120,
  // process.cwd() di lib/posts.ts dll bikin file tracing ikut membawa seluruh
  // repo (public/ ~650MB, backend/, dst) ke tiap Vercel Function. public/
  // sudah disajikan CDN, Function tidak butuh.
  outputFileTracingExcludes: {
    "*": [
      "public/Million-Candles/**",
      "public/dashboard/**",
      "public/assets/**",
      "blog/**/*.{png,jpg,jpeg,webp,gif}",
      "public/**/*.{png,jpg,jpeg,JPG,JPEG,webp,gif,svg,ico,HEIC,heic,mp4,mov,pdf,xml}",
      "backend/**",
      "media-archive/**",
      "pages/**",
      "components/**",
      "*.tsbuildinfo",
      "pnpm-lock.yaml",
      "docs/**",
      "scripts/**",
      "tests/**",
      "erp/**",
      ".git/**",
      ".next/cache/**",
      "node_modules/@swc/core*/**",
      "node_modules/@esbuild/**",
      "node_modules/typescript/**",
      "node_modules/million-candles/**",
    ],
  },
  // Yang memang dibaca saat runtime: markdown blog, dokumen, terjemahan.
  outputFileTracingIncludes: {
    "*": [
      "blog/**/*.md",
      "public/document/**/*.md",
      "public/locales/**/*.json",
    ],
  },
  typescript: {
    // Ignore TypeScript errors during production builds
    ignoreBuildErrors: true,
  },
  i18n,
  // Foto produk sudah dikonversi ke WebP; link lama (Google Images, situs lain)
  // diarahkan ke file .webp.
  async redirects() {
    return [
      {
        source:
          "/Million-Candles/:base(.+)\\.:ext(png|PNG|jpg|JPG|jpeg|JPEG|heic|HEIC)",
        destination: "/Million-Candles/:base.webp",
        permanent: true,
      },
    ];
  },
  images: {
    domains: [
      "randomuser.me",
      "picsum.photos",
      "firebasestorage.googleapis.com",
      "cdn.dribbble.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "codeverta.com",
        pathname: "/assets/**",
      },
    ],
  },
};

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "cigar",
  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
