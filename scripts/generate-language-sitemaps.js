const fs = require("fs");
const path = require("path");
const { i18n } = require("../next-i18next.config");

// Read the main sitemap
const readSitemap = () => {
  const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
  const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
  return sitemapContent;
};

// Ensure the output directory exists
const sitemapDir = path.join(process.cwd(), "public", "sitemaps");
if (!fs.existsSync(sitemapDir)) {
  fs.mkdirSync(sitemapDir, { recursive: true });
}

// Generate language‐specific sitemaps
const generateLanguageSitemaps = () => {
  const mainSitemap = readSitemap();
  const baseUrl = process.env.SITE_URL || "https://souvenirlilin.id";

  i18n.locales.forEach((locale) => {
    console.log(`Processing sitemap for ${locale}...`);

    let langSitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    langSitemap +=
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ';
    langSitemap += 'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

    const urlRegex = /<url>([\s\S]*?)<\/url>/g;
    let match;
    while ((match = urlRegex.exec(mainSitemap)) !== null) {
      const urlContent = match[1];
      const locMatch = /<loc>(.*?)<\/loc>/.exec(urlContent);
      if (!locMatch || !locMatch[1]) continue;
      const mainUrl = locMatch[1];

      // Only process URLs belonging to this locale
      const localePathPattern = new RegExp(`^${baseUrl}/${locale}(/|$)`);
      if (!localePathPattern.test(mainUrl)) continue;

      // Build new URL entry
      let newUrlContent = `    ${locMatch[0]}\n`;

      const lastmodMatch = /<lastmod>(.*?)<\/lastmod>/.exec(urlContent);
      if (lastmodMatch) {
        newUrlContent += `    ${lastmodMatch[0]}\n`;
      }

      // Only include alternate links whose “tails” match exactly
      const linkRegex =
        /<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)"\/>/g;
      let linkMatch;
      while ((linkMatch = linkRegex.exec(urlContent)) !== null) {
        const linkLang = linkMatch[1];
        const linkHref = linkMatch[2];

        const originalTail = mainUrl.replace(`${baseUrl}/${locale}`, "");
        const candidateTail = linkHref.replace(`${baseUrl}/${linkLang}`, "");

        if (candidateTail === originalTail) {
          newUrlContent += `    ${linkMatch[0]}\n`;
        } else {
          console.log(
            `  Skipping invalid alternate link (path mismatch): ${linkMatch[0]}`
          );
        }
      }

      langSitemap += `  <url>\n${newUrlContent}  </url>\n`;
    }

    langSitemap += "</urlset>";

    // Write out per‐locale sitemap
    fs.writeFileSync(
      path.join(sitemapDir, `sitemap-${locale}.xml`),
      langSitemap
    );
    console.log(`Generated sitemap for ${locale}`);
  });

  // Build the sitemap index
  let sitemapIndex = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemapIndex +=
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  i18n.locales.forEach((locale) => {
    sitemapIndex += "  <sitemap>\n";
    sitemapIndex += `    <loc>${baseUrl}/sitemaps/sitemap-${locale}.xml</loc>\n`;
    sitemapIndex += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    sitemapIndex += "  </sitemap>\n";
  });

  sitemapIndex += "</sitemapindex>";

  fs.writeFileSync(
    path.join(process.cwd(), "public", "sitemap-index.xml"),
    sitemapIndex
  );
  console.log("Generated sitemap index");
};

// Run it
generateLanguageSitemaps();
