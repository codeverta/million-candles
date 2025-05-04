module.exports = {
  i18n: {
    defaultLocale: "id",
    locales: ["id", "en", "ja", "kr", "zh", "hi", "th", "vi"],
    localeDetection: false,
  },
  localePath: "./public/locales",
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
