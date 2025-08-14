// next-sitemap.config.js

const { i18n } = require("./next-i18next.config");
const fs = require("fs");
const path = require("path");

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://souvenirlilin.id",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 5000,
  transform: async (config, path) => {
    // path akan berisi sesuatu seperti '/posts/slug-artikel'
    // Default locale 'id' seringkali tidak memiliki prefix, jadi kita normalkan dulu
    const defaultLocale = i18n.defaultLocale;
    let pagePath = path;

    // Cek apakah path dimulai dengan salah satu locale
    const allLocales = i18n.locales;
    let pathLocale = allLocales.find((locale) =>
      pagePath.startsWith(`/${locale}/`)
    );

    if (pathLocale) {
      // Hapus prefix locale dari path untuk mendapatkan slug dasar
      // contoh: dari '/en/posts/slug' menjadi '/posts/slug'
      pagePath = pagePath.replace(`/${pathLocale}`, "");
    } else {
      // Jika tidak ada prefix, berarti ini adalah default locale
      pathLocale = defaultLocale;
    }

    // Logika ini hanya berlaku untuk halaman postingan blog
    if (pagePath.startsWith("/posts/")) {
      const slug = pagePath.replace("/posts/", "");
      const availableLocales = [];

      // Periksa keberadaan file markdown untuk setiap bahasa
      allLocales.forEach((locale) => {
        // Sesuaikan path ini dengan struktur direktori Anda
        const markdownPath = `blog/${locale}/${slug}.md`;
        if (fs.existsSync(markdownPath)) {
          availableLocales.push(locale);
        }
      });

      // Buat alternateRefs hanya untuk bahasa yang filenya ada
      const alternateRefs = availableLocales.map((locale) => {
        // Untuk default locale, jangan tambahkan prefix jika struktur URL Anda seperti itu
        const href =
          locale === defaultLocale
            ? `${config.siteUrl}${pagePath}`
            : `${config.siteUrl}/${locale}${pagePath}`;

        return {
          href,
          hreflang: locale,
        };
      });

      return {
        loc: path, // URL asli yang ditemukan
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: 0.7,
        alternateRefs: alternateRefs,
      };
    }

    // Untuk halaman lain (bukan postingan blog), kembalikan properti default
    return {
      loc: path,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 0.7,
    };
  },
};
