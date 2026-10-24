import { NextRequest, NextResponse } from "next/server";

const PREFERRED_HOST = "souvenirlilin.id";
const ALTERNATE_HOST = `www.${PREFERRED_HOST}`;
const LOCALES = new Set([
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
  "pt",
  "ru",
  "th",
  "vi",
  "zh",
]);

export function middleware(request: NextRequest) {
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",", 1)[0]
    .trim();
  const requestHost =
    forwardedHost || request.headers.get("host") || request.nextUrl.host;
  const hostname = new URL(`http://${requestHost}`).hostname.toLowerCase();
  const forwardedProtocol = request.headers
    .get("x-forwarded-proto")
    ?.split(",", 1)[0]
    .trim()
    .toLowerCase();
  const protocol =
    forwardedProtocol || request.nextUrl.protocol.replace(/:$/, "");
  const isAlternateHost = hostname === ALTERNATE_HOST;
  const isInsecurePreferredHost =
    hostname === PREFERRED_HOST && protocol !== "https";

  if (isAlternateHost || isInsecurePreferredHost) {
    const destination = request.nextUrl.clone();
    destination.protocol = "https:";
    destination.hostname = PREFERRED_HOST;
    destination.port = "";

    return NextResponse.redirect(destination, 308);
  }

  const response = NextResponse.next();
  const pathSegments = request.nextUrl.pathname.split("/").filter(Boolean);
  const postPathIndex = LOCALES.has(pathSegments[0]) ? 1 : 0;
  const isBlogSearch =
    pathSegments[postPathIndex] === "posts" &&
    ["search", "category"].some((key) =>
      request.nextUrl.searchParams.getAll(key).some(Boolean)
    );

  if (isBlogSearch) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }

  return response;
}

export const config = {
  matcher: "/:path*",
};
