const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { after, before, test } = require("node:test");
const {
  SITEMAP_LOCALES,
  escapeXml,
  listPublicSitemapPaths,
} = require("../lib/sitemap-shared.cjs");

let apiServer;
let sitemapServer;
let sitemapUrl;
let sitemapConfig;

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.removeListener("error", reject);
      resolve(server.address().port);
    });
  });
}

before(async () => {
  apiServer = http.createServer((request, response) => {
    response.setHeader("Content-Type", "application/vnd.api+json");
    if (request.url.startsWith("/api/v1/products")) {
      response.end(
        JSON.stringify({
          jsonapi: { version: "1.0" },
          data: [
            {
              id: "seo-http-test-product",
              type: "products",
              attributes: { slug: "seo-http-test-candle" },
            },
          ],
          links: { self: request.url, next: null },
        })
      );
      return;
    }

    response.statusCode = 404;
    response.end(JSON.stringify({ errors: [] }));
  });

  const apiPort = await listen(apiServer);
  process.env.NEXT_PUBLIC_BASE_API = `http://127.0.0.1:${apiPort}/api/v1`;
  sitemapConfig = require("../next-sitemap.config.js");

  sitemapServer = http.createServer(async (_request, response) => {
    try {
      const entries = await sitemapConfig.additionalPaths(sitemapConfig);
      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...entries.map(
          (entry) => `  <url><loc>${escapeXml(entry.loc)}</loc></url>`
        ),
        "</urlset>",
      ].join("\n");
      response.setHeader("Content-Type", "application/xml; charset=utf-8");
      response.end(xml);
    } catch (error) {
      response.statusCode = 500;
      response.end(String(error));
    }
  });

  const sitemapPort = await listen(sitemapServer);
  sitemapUrl = `http://127.0.0.1:${sitemapPort}/sitemap.xml`;
});

after(async () => {
  for (const server of [sitemapServer, apiServer]) {
    if (server?.listening) {
      await new Promise((resolve) => server.close(resolve));
    }
  }
});

test("postbuild sitemap HTTP response lists eligible canonical URLs only", async () => {
  assert.equal(sitemapConfig.siteUrl, "https://souvenirlilin.id");
  assert.equal(await sitemapConfig.transform(sitemapConfig, "/admin"), null);
  assert.equal(
    await sitemapConfig.transform(sitemapConfig, "/posts?search=candle"),
    null
  );

  const response = await fetch(sitemapUrl);
  const xml = await response.text();
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1]
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /application\/xml/i);
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.ok(locations.includes("https://souvenirlilin.id/"));
  assert.ok(locations.includes("https://souvenirlilin.id/en"));
  assert.ok(
    locations.includes("https://souvenirlilin.id/products/seo-http-test-candle")
  );
  assert.ok(
    locations.includes(
      "https://souvenirlilin.id/en/posts/01-incredible-benefits-of-choosing-a-candle-exporter-in-indonesia"
    )
  );
  assert.ok(
    locations.every((location) =>
      location.startsWith("https://souvenirlilin.id/")
    )
  );
  assert.ok(
    locations.every(
      (location) =>
        !/\/(admin|store|cart|checkout|invoice|cek-order|sentry-example-page|404|500)(\/|$)/.test(
          new URL(location).pathname
        )
    )
  );
  assert.ok(locations.every((location) => !new URL(location).search));
  assert.ok(!locations.includes("https://souvenirlilin.id/en/contact"));
  assert.ok(!locations.includes("https://souvenirlilin.id/en/address"));
});

test("every allowlisted sitemap path maps to a real page and locale source", () => {
  const repoRoot = path.resolve(__dirname, "..");
  const supportedLocales = new Set(SITEMAP_LOCALES);
  const staticPageFiles = {
    "/": "pages/index.tsx",
    "/about": "pages/about.tsx",
    "/address": "pages/address.tsx",
    "/candles/15": "pages/candles/15.tsx",
    "/cara-order": "pages/cara-order.tsx",
    "/contact": "pages/contact.tsx",
    "/faq": "pages/faq.tsx",
    "/gallery": "pages/gallery.tsx",
    "/posts": "pages/posts/index.tsx",
    "/products": "pages/products/index.tsx",
    "/privacy": "pages/privacy.tsx",
    "/return-policy": "pages/return-policy.tsx",
    "/shipping-policy": "pages/shipping-policy.tsx",
    "/terms": "pages/terms.tsx",
  };

  for (const pathname of listPublicSitemapPaths()) {
    const segments = pathname.split("/").filter(Boolean);
    const locale = supportedLocales.has(segments[0]) ? segments[0] : "id";
    const routePath =
      locale === "id" ? pathname : `/${segments.slice(1).join("/")}` || "/";

    if (routePath.startsWith("/posts/") && routePath !== "/posts") {
      const slug = decodeURIComponent(routePath.slice("/posts/".length));
      assert.ok(
        fs.existsSync(path.join(repoRoot, "blog", locale, `${slug}.md`)),
        `${pathname} must have a matching localized article`
      );
      continue;
    }

    const pageFile = staticPageFiles[routePath];
    assert.ok(pageFile, `${pathname} must map to a public static page`);
    assert.ok(
      fs.existsSync(path.join(repoRoot, pageFile)),
      `${pathname} must have a page file`
    );

    const documentNames = {
      "/faq": "faq.md",
      "/privacy": "privacy.md",
      "/return-policy": "return.md",
      "/shipping-policy": "shipping-policy.md",
      "/terms": "terms.md",
    };
    if (locale !== "id" && documentNames[routePath]) {
      assert.ok(
        fs.existsSync(
          path.join(
            repoRoot,
            "public",
            "document",
            locale,
            documentNames[routePath]
          )
        ),
        `${pathname} must have a matching localized document`
      );
    }

    if (
      locale !== "id" &&
      ![
        "/faq",
        "/privacy",
        "/return-policy",
        "/shipping-policy",
        "/terms",
      ].includes(routePath)
    ) {
      assert.ok(
        fs.existsSync(
          path.join(
            repoRoot,
            "public",
            "locales",
            locale,
            routePath === "/cara-order" ? "order.json" : "common.json"
          )
        ),
        `${pathname} must have a matching locale resource`
      );
    }
  }
});
