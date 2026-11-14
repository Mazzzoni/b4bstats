// Writes public/robots.txt and public/sitemap.xml before `next build` (the static export used to get them
// from next-sitemap). Lists every indexable page in every locale, with hreflang alternates; redirect-only
// pages (/players, /player) and per-player profiles are left out.
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';

const site = 'https://b4bstats.mazz.lol';
const pages = [
  '/',
  '/leaderboards/',
  '/overall/',
  '/weapons/',
  '/riddens/',
  '/self/',
  '/compare/',
  '/about/',
];

const { i18n } = createRequire(import.meta.url)('../next.config.js');
const locales = i18n.locales.filter((locale) => locale !== 'default');
const url = (locale, page) => `${site}/${locale}${page}`;

const entries = pages.flatMap((page) =>
  locales.map((locale) =>
    [
      '  <url>',
      `    <loc>${url(locale, page)}</loc>`,
      ...locales.map(
        (alternate) =>
          `    <xhtml:link rel="alternate" hreflang="${alternate}" href="${url(alternate, page)}"/>`,
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${url('en', page)}"/>`,
      '  </url>',
    ].join('\n'),
  ),
);

writeFileSync(
  new URL('../public/sitemap.xml', import.meta.url),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n'),
);
writeFileSync(
  new URL('../public/robots.txt', import.meta.url),
  ['User-agent: *', 'Allow: /', 'Disallow: /api/', '', `Sitemap: ${site}/sitemap.xml`, ''].join(
    '\n',
  ),
);
console.log(`sitemap: ${entries.length} URLs (${pages.length} pages x ${locales.length} locales)`);
