export const SITE_URL = "https://souvenirlilin.id";

const SUPPORTED_LOCALES = [
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

const LANGUAGE_TAGS: Record<string, string> = {
  kr: "ko",
};

const NON_INDEXABLE_PATHS = new Set([
  "/cart",
  "/cek-order",
  "/invoice",
  "/_error",
  "/404",
  "/500",
  "/_offline",
  "/sentry-example-page",
  "/privacy-and-policy/jiwaku",
]);

/**
 * Build a clean canonical URL from the route currently being rendered.
 * Query strings and fragments are intentionally omitted because they do not
 * create a distinct indexable page on this site. The router locale is used to
 * restore the locale prefix when Next.js supplies an unprefixed asPath.
 */
export function getCanonicalUrl(
  asPath: string,
  locale = "id",
  defaultLocale = "id",
  locales: readonly string[] = SUPPORTED_LOCALES
) {
  const rawPath = (asPath || "/").split(/[?#]/, 1)[0] || "/";
  const pathWithLeadingSlash = rawPath.startsWith("/")
    ? rawPath
    : `/${rawPath}`;
  const segments = pathWithLeadingSlash.split("/");

  // Remove any existing locale prefix before adding the resolved locale.
  if (locales.includes(segments[1])) segments.splice(1, 1);

  let pathname = segments.join("/").replace(/\/{2,}/g, "/");
  if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  if (pathname.length > 1) pathname = pathname.replace(/\/+$/, "");

  const localePrefix = locale && locale !== defaultLocale ? `/${locale}` : "";
  const canonicalPath =
    pathname === "/" ? localePrefix || "/" : `${localePrefix}${pathname}`;

  return `${SITE_URL}${canonicalPath}`;
}

/** Return a standards-based language tag for the selected UI locale. */
export function getLanguageTag(locale?: string) {
  if (!locale) return "id";
  return LANGUAGE_TAGS[locale] || locale;
}

/**
 * Utility and private pages should remain crawlable so crawlers can see this
 * directive, but should not be eligible for search results. This does not
 * replace authentication or authorization on any route.
 */
export function shouldNoIndex(
  pathname: string,
  query: Record<string, string | string[] | undefined> = {},
  asPath = ""
) {
  if (
    NON_INDEXABLE_PATHS.has(pathname) ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/store" ||
    pathname.startsWith("/store/") ||
    pathname === "/checkout" ||
    pathname.startsWith("/checkout/")
  ) {
    return true;
  }

  const urlQuery = new URL(asPath || "/", SITE_URL).searchParams;
  const hasSearchOrCategory = ["search", "category"].some((key) => {
    const value = query[key];
    const hasRouterValue = Array.isArray(value)
      ? value.some(Boolean)
      : Boolean(value);
    return hasRouterValue || urlQuery.getAll(key).some(Boolean);
  });

  if (pathname === "/posts" && hasSearchOrCategory) {
    return true;
  }

  return false;
}
