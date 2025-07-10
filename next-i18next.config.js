module.exports = {
  i18n: {
    defaultLocale: "id",
    locales: [
      "ar",
      "de",
      "en",
      "es",
      "fr",
      "id",
      "ja",
      "kr",
      "ms",
      "ru",
      "th",
      "vi",
      "zh",
      "hi",
    ],
    localeDetection: false,
  },
  localePath: "./public/locales",
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
