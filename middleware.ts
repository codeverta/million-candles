// middleware.js
import { NextRequest, NextResponse } from "next/server";

const validLocales = [
  "ar",
  "bn",
  "de",
  "en",
  "es",
  "fr",
  "id",
  "ja",
  "kr",
  "ms",
  "ru",
  "pt",
  "th",
  "vi",
  "zh",
  "hi",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if path has double locale (e.g., /es/ms)
  const pathSegments = pathname.split("/").filter(Boolean);

  if (pathSegments.length >= 2) {
    const firstSegment = pathSegments[0];
    const secondSegment = pathSegments[1];

    // If both segments are valid locales, it's an invalid combination
    if (
      validLocales.includes(firstSegment) &&
      validLocales.includes(secondSegment)
    ) {
      // Redirect to the first locale only
      const correctPath = `/${firstSegment}`;
      return NextResponse.redirect(new URL(correctPath, request.url), 301);
    }
  }

  return NextResponse.next();
}

// Matcher config - penting untuk performa
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|_next/data|favicon.ico|images|locales|robots.txt|sitemap.xml).*)",
  ],
};
