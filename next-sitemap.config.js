const path = require("node:path");
const { i18n } = require("./next-i18next.config");
const {
  fetchPublicProductSlugs,
  listPublicSitemapPaths,
} = require("./lib/sitemap-shared.cjs");

// The owner confirmed this as the preferred production/Search Console host.
// Both the HTML canonicals and sitemap use this bare HTTPS origin.
const SITE_URL = "https://souvenirlilin.id";

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  autoLastmod: false,
  trailingSlash: false,
  sitemapSize: 5000,

  // Use a strict allowlist. Next's page manifest also contains admin, API,
  // component, and utility routes that must never become sitemap entries.
  transform: async () => null,

  additionalPaths: async () => {
    let productSlugs;
    try {
      productSlugs = await fetchPublicProductSlugs();
    } catch (error) {
      throw new Error(
        "Could not build the SEO sitemap because public product URLs could not be loaded.",
        { cause: error }
      );
    }

    return listPublicSitemapPaths({
      blogDirectory: path.join(__dirname, "blog"),
      locales: i18n.locales,
      defaultLocale: i18n.defaultLocale,
      productSlugs,
    }).map((pathname) => ({
      loc: `${SITE_URL}${pathname}`,
      trailingSlash: pathname === "/",
      changefreq: pathname.startsWith("/products/") ? "daily" : "weekly",
      priority: pathname.startsWith("/products/") ? 0.8 : 0.6,
    }));
  },
};
