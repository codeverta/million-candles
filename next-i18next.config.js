module.exports = {
  i18n: {
    defaultLocale: "id",
    locales: [
      "id",
      "en",
      "ja",
      "kr",
      "zh",
      "hi",
      "th",
      "vi",
      "ms",
      "de",
      "fr",
      "es",
      "ru",
    ],
    localeDetection: true,
  },
  localePath: "./public/locales",
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
