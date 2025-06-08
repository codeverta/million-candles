// next-sitemap.config.js
const { i18n } = require("./next-i18next.config");

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://souvenirlilin.id",
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  alternateRefs: i18n.locales.map((locale) => ({
    href: `${process.env.SITE_URL || "https://souvenirlilin.id"}/${locale}`,
    hreflang: locale,
  })),
  // Create a sitemap per language
  sitemapSize: 5000,
};
