import { legacyOverviewDestination } from '@utils/overviewRoutes';
import { NextRequest, NextResponse } from 'next/server';
const locales = new Set(['en', 'fr', 'de', 'es', 'nl', 'ru', 'zh-TW', 'ja', 'ko']);
export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (
    path.startsWith('/api') ||
    path.startsWith('/_next') ||
    /^\/(images|fonts|assets)(\/|$)/.test(path) ||
    /^\/(favicon\.ico|robots\.txt|sitemap\.xml)$/.test(path)
  )
    return NextResponse.next();
  if (req.nextUrl.locale === 'default') {
    const preferred = req.cookies.get('NEXT_LOCALE')?.value ?? 'en';
    const locale = locales.has(preferred) ? preferred : 'en';
    return NextResponse.redirect(new URL('/' + locale + path + req.nextUrl.search, req.url));
  }
  const destination = legacyOverviewDestination(path, req.nextUrl.search);
  if (destination) {
    const url = req.nextUrl.clone();
    const [pathname, search = ''] = destination.split('?');
    url.pathname = pathname;
    url.search = search;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
