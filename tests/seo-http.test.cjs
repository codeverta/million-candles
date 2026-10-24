const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const net = require("node:net");
const path = require("node:path");
const { after, before, test } = require("node:test");
const { escapeXml } = require("../lib/sitemap-shared.cjs");

const repoRoot = path.resolve(__dirname, "..");
let apiServer;
let appServer;
let baseUrl;
let apiBaseUrl;
let appOutput = "";
let previousSitemapFile;
const productRequests = [];
const sitemapFilePath = path.join(repoRoot, "public", "sitemap.xml");

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.removeListener("error", reject);
      resolve(server.address().port);
    });
  });
}

async function freePort() {
  const server = net.createServer();
  const port = await listen(server);
  await new Promise((resolve) => server.close(resolve));
  return port;
}

function fakeProduct(slug) {
  return {
    id: "seo-http-test-product",
    type: "products",
    attributes: {
      name: "HTTP SEO Test Candle",
      slug,
      description: "A product used to verify crawler-visible SEO output.",
      code: "SEO-HTTP-TEST",
      price: 10000,
      priceInCurrency: 10000,
      stock: 5,
      product_reviews: [],
    },
    relationships: { documents: { data: [] } },
  };
}

async function warmPage(pathname) {
  const startedAt = Date.now();
  let lastStatus = "unreachable";
  let lastBody = "";

  while (Date.now() - startedAt < 30_000) {
    try {
      const response = await fetch(`${baseUrl}${pathname}`);
      lastStatus = response.status;
      lastBody = (await response.text()).slice(0, 500);
      if (response.status === 200) return;
    } catch (_error) {
      // Next.js may still be compiling this page in development mode.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(
    `Next.js could not warm ${pathname}: HTTP ${lastStatus}. ${lastBody}\n${appOutput.slice(
      -3000
    )}`
  );
}

before(async () => {
  apiServer = http.createServer((request, response) => {
    response.setHeader("Content-Type", "application/vnd.api+json");
    if (request.url.startsWith("/api/v1/products")) {
      productRequests.push(request.url);
      const requestedSlug = new URL(
        request.url,
        "http://localhost"
      ).searchParams.get("filter[slug]");
      response.end(
        JSON.stringify({
          jsonapi: { version: "1.0" },
          data: requestedSlug
            ? [fakeProduct(requestedSlug)]
            : [fakeProduct("seo-http-test-candle")],
          links: { self: request.url, next: null },
        })
      );
      return;
    }
    response.statusCode = 404;
    response.end(JSON.stringify({ errors: [] }));
  });

  const apiPort = await listen(apiServer);
  apiBaseUrl = `http://127.0.0.1:${apiPort}/api/v1`;
  process.env.NEXT_PUBLIC_BASE_API = apiBaseUrl;
  const sitemapConfig = require("../next-sitemap.config.js");
  previousSitemapFile = fs.existsSync(sitemapFilePath)
    ? fs.readFileSync(sitemapFilePath)
    : null;
  const sitemapEntries = await sitemapConfig.additionalPaths(sitemapConfig);
  const sitemapXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemapEntries.map(
      (entry) => `  <url><loc>${escapeXml(entry.loc)}</loc></url>`
    ),
    "</urlset>",
  ].join("\n");
  fs.writeFileSync(sitemapFilePath, sitemapXml);

  const appPort = await freePort();
  baseUrl = `http://127.0.0.1:${appPort}`;
  appServer = spawn(
    process.execPath,
    [
      require.resolve("next/dist/bin/next"),
      "dev",
      "--port",
      String(appPort),
      "--hostname",
      "127.0.0.1",
    ],
    {
      cwd: repoRoot,
      env: {
        ...process.env,
        CI: "1",
        NEXT_PUBLIC_BASE_API: apiBaseUrl,
        SENTRY_AUTH_TOKEN: "",
      },
      stdio: ["ignore", "pipe", "pipe"],
    }
  );
  appServer.stdout.setEncoding("utf8");
  appServer.stderr.setEncoding("utf8");
  appServer.stdout.on("data", (chunk) => (appOutput += chunk));
  appServer.stderr.on("data", (chunk) => (appOutput += chunk));

  const startedAt = Date.now();
  while (Date.now() - startedAt < 120_000) {
    if (appServer.exitCode !== null) {
      throw new Error(
        `Next.js exited before becoming ready:\n${appOutput.slice(-8000)}`
      );
    }
    try {
      const response = await fetch(baseUrl);
      if (response.status === 200) {
        await warmPage(
          "/posts/75-tempat-jual-lilin-terdekat-di-jogja-yang-wajib-kamu-kunjungi"
        );
        await warmPage("/products/seo-http-test-candle");
        return;
      }
    } catch (_error) {
      // The development server is not listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Next.js did not become ready:\n${appOutput.slice(-8000)}`);
});

after(async () => {
  if (appServer && appServer.exitCode === null) {
    appServer.kill("SIGTERM");
    await new Promise((resolve) => appServer.once("exit", resolve));
  }
  if (apiServer?.listening) {
    await new Promise((resolve) => apiServer.close(resolve));
  }
  if (previousSitemapFile === null) {
    fs.rmSync(sitemapFilePath, { force: true });
  } else if (previousSitemapFile) {
    fs.writeFileSync(sitemapFilePath, previousSitemapFile);
  }
});

async function getHtml(pathname, options = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    redirect: options.redirect || "follow",
    headers: options.headers,
  });
  return { response, html: await response.text() };
}

function canonicalLinks(html) {
  return [...html.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi)].map(
    (match) => match[0]
  );
}

test("www requests permanently redirect to the bare HTTPS host and retain query strings", async () => {
  const response = await fetch(
    `${baseUrl}/en/posts/article?campaign=seo&from=www`,
    {
      redirect: "manual",
      headers: {
        host: "www.souvenirlilin.id",
        "x-forwarded-host": "www.souvenirlilin.id",
        "x-forwarded-proto": "https",
      },
    }
  );

  assert.equal(response.status, 308);
  assert.equal(
    response.headers.get("location"),
    "https://souvenirlilin.id/en/posts/article?campaign=seo&from=www"
  );
});

test("bare-host HTTP requests permanently upgrade to HTTPS and retain the path and query", async () => {
  const response = await fetch(`${baseUrl}/contact?source=http-test`, {
    redirect: "manual",
    headers: {
      host: "souvenirlilin.id",
      "x-forwarded-host": "souvenirlilin.id",
      "x-forwarded-proto": "http",
    },
  });

  assert.equal(response.status, 308);
  assert.equal(
    response.headers.get("location"),
    "https://souvenirlilin.id/contact?source=http-test"
  );
});

test("public pages emit a single clean canonical, preserve locale, and set the document language", async () => {
  const home = await getHtml("/?utm_source=seo-test");
  assert.equal(
    home.response.status,
    200,
    `Homepage returned ${home.response.status}`
  );
  assert.equal(canonicalLinks(home.html).length, 1);
  assert.match(
    canonicalLinks(home.html)[0],
    /href="https:\/\/souvenirlilin\.id\/"/
  );
  const homeJsonLd = [
    ...home.html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
    ),
  ]
    .map((match) => match[1])
    .join("\n");
  assert.doesNotMatch(
    homeJsonLd,
    /LocalBusiness|ratingCount|Andi Pratama|Siti Nurhaliza/
  );

  const englishHome = await getHtml("/en?utm_source=test");
  assert.equal(
    englishHome.response.status,
    200,
    `English homepage returned ${englishHome.response.status}`
  );
  assert.equal(canonicalLinks(englishHome.html).length, 1);
  assert.match(
    canonicalLinks(englishHome.html)[0],
    /href="https:\/\/souvenirlilin\.id\/en"/
  );
  assert.match(englishHome.html, /<html lang="en">/);

  const article = await getHtml(
    "/posts/75-tempat-jual-lilin-terdekat-di-jogja-yang-wajib-kamu-kunjungi?utm_source=test"
  );
  assert.equal(
    article.response.status,
    200,
    `Article returned ${article.response.status}`
  );
  assert.equal(canonicalLinks(article.html).length, 1);
  assert.match(
    article.html,
    /href="https:\/\/souvenirlilin\.id\/posts\/75-tempat-jual-lilin-terdekat-di-jogja-yang-wajib-kamu-kunjungi"/
  );
  assert.match(article.html, /<html lang="id">/);
  assert.doesNotMatch(
    article.html,
    /<link\b[^>]*rel=["']alternate["'][^>]*hreflang=/i
  );
});

test("product pages emit one canonical on the preferred host and ignore tracking query parameters", async () => {
  const { response, html } = await getHtml(
    "/products/seo-http-test-candle?utm_source=seo-test"
  );

  assert.equal(
    response.status,
    200,
    `Product returned ${response.status}; API requests: ${productRequests.join(
      ", "
    )}`
  );
  assert.equal(canonicalLinks(html).length, 1);
  assert.match(
    html,
    /href="https:\/\/souvenirlilin\.id\/products\/seo-http-test-candle"/
  );
  assert.doesNotMatch(html, /https:\/\/www\.souvenirlilin\.id/);
  const productJsonLd = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
    ),
  ]
    .map((match) => match[1])
    .join("\n");
  assert.doesNotMatch(productJsonLd, /OfferShippingDetails|shippingRate/);
});

test("contact page exposes equally visible shop and church paths and a WhatsApp form handoff", async () => {
  const { response, html } = await getHtml("/contact");

  assert.equal(
    response.status,
    200,
    `Contact page returned ${response.status}`
  );
  assert.match(html, /Saya mewakili toko perlengkapan ibadah/);
  assert.match(html, /Saya mewakili gereja/);
  assert.match(html, /Buka WhatsApp untuk mengirim/);
});

test("blog search results stay functional but expose noindex and a clean canonical", async () => {
  const { response, html } = await getHtml(
    "/posts?search=candle&category=guide"
  );

  assert.equal(
    response.status,
    200,
    `Search results returned ${response.status}`
  );
  assert.equal(canonicalLinks(html).length, 1);
  assert.match(
    canonicalLinks(html)[0],
    /href="https:\/\/souvenirlilin\.id\/posts"/
  );
  assert.match(response.headers.get("x-robots-tag"), /noindex,\s*follow/i);
});

test("Next.js serves the generated sitemap at /sitemap.xml in development", async () => {
  const response = await fetch(`${baseUrl}/sitemap.xml`);
  const xml = await response.text();
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1]
  );

  assert.equal(response.status, 200, `Sitemap returned ${response.status}`);
  assert.match(response.headers.get("content-type"), /application\/xml/i);
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
  assert.ok(locations.every((location) => !new URL(location).search));
  assert.ok(
    locations.every(
      (location) =>
        !/\/(admin|store|cart|checkout|invoice|cek-order|sentry-example-page|404|500)(\/|$)/.test(
          new URL(location).pathname
        )
    )
  );
  assert.ok(!locations.includes("https://souvenirlilin.id/en/contact"));
  assert.ok(!locations.includes("https://souvenirlilin.id/en/address"));
});
