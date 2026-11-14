module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  distDir: process.env.NEXT_DIST_DIR || '.next/main',
  output: 'standalone',
  trailingSlash: true,
  i18n: {
    locales: ['default', 'en', 'fr', 'de', 'es', 'nl', 'ru', 'zh-TW', 'ja', 'ko'],
    defaultLocale: 'default',
    localeDetection: false,
  },
};
