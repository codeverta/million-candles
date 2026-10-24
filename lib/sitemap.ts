type SitemapOptions = {
  blogDirectory?: string;
  locales?: readonly string[];
  defaultLocale?: string;
  siteUrl?: string;
  productSlugs?: readonly string[];
};

const { listPublicSitemapPaths, fetchPublicProductSlugs, escapeXml } =
  require("./sitemap-shared.cjs") as {
    listPublicSitemapPaths: (options?: SitemapOptions) => string[];
    fetchPublicProductSlugs: (apiBaseUrl?: string) => Promise<string[]>;
    escapeXml: (value: string) => string;
  };

export { fetchPublicProductSlugs };

export function buildSitemapXml({
  siteUrl = "https://souvenirlilin.id",
  ...options
}: SitemapOptions = {}) {
  const normalizedSiteUrl = siteUrl.replace(/\/+$/, "");
  const xmlUrls = listPublicSitemapPaths(options)
    .map(
      (pathname: string) =>
        `  <url><loc>${escapeXml(
          `${normalizedSiteUrl}${pathname}`
        )}</loc></url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlUrls}\n</urlset>`;
}
