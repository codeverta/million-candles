const fs = require("node:fs");
const path = require("node:path");

const PUBLIC_SITEMAP_PATHS = [
  "/",
  "/about",
  "/address",
  "/candles/15",
  "/cara-order",
  "/contact",
  "/faq",
  "/gallery",
  "/posts",
  "/products",
  "/privacy",
  "/return-policy",
  "/shipping-policy",
  "/terms",
];

const SITEMAP_LOCALES = [
  "ar",
  "bn",
  "de",
  "en",
  "es",
  "fr",
  "hi",
  "id",
  "ja",
  "kr",
  "ms",
  "ru",
  "pt",
  "th",
  "vi",
  "zh",
];

const TRANSLATED_STATIC_PAGES = {
  "/": { namespace: "common", key: "homepage.title" },
  "/about": { namespace: "common", key: "about.title" },
  "/cara-order": { namespace: "order", key: "howToOrder.title" },
  "/contact": { namespace: "common", key: "contact.hero_title" },
  "/gallery": { namespace: "common", key: "gallery.title" },
  "/posts": { namespace: "common", key: "blog.title" },
  "/products": { namespace: "common", key: "products.title" },
};

const DOCUMENT_PAGES = {
  "/faq": "faq.md",
  "/privacy": "privacy.md",
  "/return-policy": "return.md",
  "/shipping-policy": "shipping-policy.md",
  "/terms": "terms.md",
};

const translationCache = new Map();

function localizedPathname(pathname, locale, defaultLocale) {
  if (locale === defaultLocale) return pathname;
  return pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
}

function hasLocalizedStaticPage(pathname, locale, defaultLocale) {
  if (locale === defaultLocale) return true;

  const documentName = DOCUMENT_PAGES[pathname];
  if (documentName) {
    return fs.existsSync(
      path.join(process.cwd(), "public", "document", locale, documentName)
    );
  }

  const requirement = TRANSLATED_STATIC_PAGES[pathname];
  if (!requirement) return false;

  const translationPath = path.join(
    process.cwd(),
    "public",
    "locales",
    locale,
    `${requirement.namespace}.json`
  );
  if (!fs.existsSync(translationPath)) return false;

  let translations = translationCache.get(translationPath);
  if (!translations) {
    try {
      translations = JSON.parse(fs.readFileSync(translationPath, "utf8"));
    } catch (_error) {
      return false;
    }
    translationCache.set(translationPath, translations);
  }

  const value = requirement.key.split(".").reduce((result, segment) => {
    return result && typeof result === "object" ? result[segment] : undefined;
  }, translations);

  return typeof value === "string" && value.trim().length > 0;
}

function listPublicSitemapPaths({
  blogDirectory = path.join(process.cwd(), "blog"),
  locales = SITEMAP_LOCALES,
  defaultLocale = "id",
  productSlugs = [],
} = {}) {
  const paths = new Set();

  for (const locale of locales) {
    const localeBlogDirectory = path.join(blogDirectory, locale);
    const localePrefix = locale === defaultLocale ? "" : `/${locale}`;

    for (const pathname of PUBLIC_SITEMAP_PATHS) {
      if (!hasLocalizedStaticPage(pathname, locale, defaultLocale)) continue;
      paths.add(localizedPathname(pathname, locale, defaultLocale));
    }

    if (fs.existsSync(localeBlogDirectory)) {
      for (const filename of fs.readdirSync(localeBlogDirectory)) {
        if (!filename.toLowerCase().endsWith(".md")) continue;
        const slug = filename.slice(0, -3);
        paths.add(`${localePrefix}/posts/${encodeURIComponent(slug)}`);
      }
    }

    // The product API does not expose a verified translation map, so only
    // default-language product URLs are eligible for this sitemap.
    if (locale === defaultLocale) {
      for (const slug of productSlugs) {
        if (typeof slug === "string" && slug.trim()) {
          paths.add(`/products/${encodeURIComponent(slug.trim())}`);
        }
      }
    }
  }

  return [...paths].sort();
}

async function fetchPublicProductSlugs(
  apiBaseUrl = process.env.NEXT_PUBLIC_BASE_API ||
    "https://api.souvenirlilin.id/api/v1"
) {
  const normalizedBaseUrl = apiBaseUrl.endsWith("/")
    ? apiBaseUrl
    : `${apiBaseUrl}/`;
  const firstPage = new URL("products", normalizedBaseUrl);
  firstPage.searchParams.set("page[number]", "1");
  firstPage.searchParams.set("page[size]", "100");

  const allowedOrigin = firstPage.origin;
  const slugs = new Set();
  let nextUrl = firstPage;
  let pageCount = 0;

  while (nextUrl && pageCount < 100) {
    pageCount += 1;
    const response = await fetch(nextUrl, {
      headers: { Accept: "application/vnd.api+json" },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`Product sitemap API returned HTTP ${response.status}`);
    }

    const payload = await response.json();
    for (const product of payload?.data || []) {
      const slug = product?.attributes?.slug;
      if (typeof slug === "string" && slug.trim()) slugs.add(slug.trim());
    }

    const next = payload?.links?.next;
    if (typeof next !== "string" || !next) {
      nextUrl = null;
      continue;
    }

    const candidate = new URL(next, nextUrl);
    if (candidate.origin !== allowedOrigin) {
      throw new Error("Product sitemap API returned a cross-origin next link");
    }
    nextUrl = candidate;
  }

  if (nextUrl) {
    throw new Error("Product sitemap pagination exceeded 100 pages");
  }

  return [...slugs];
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

module.exports = {
  PUBLIC_SITEMAP_PATHS,
  SITEMAP_LOCALES,
  listPublicSitemapPaths,
  fetchPublicProductSlugs,
  escapeXml,
};
