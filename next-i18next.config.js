module.exports = {
  i18n: {
    defaultLocale: "id",
    locales: ["id", "en", "ja", "kr", "zh"],
    localeDetection: false,
  },
  localePath: "./public/locales",
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
