export const overviewRoutes = {
  community: '/',
  official: '/leaderboards/',
  overall: '/overall/',
} as const;

export type OverviewSection = keyof typeof overviewRoutes;

/** Resolve old tab bookmarks before rendering, so analytics sees only the destination page. */
export function legacyOverviewDestination(pathname: string, search: string): string | null {
  if (!['/', '/leaderboards', '/leaderboards/', '/overall', '/overall/'].includes(pathname))
    return null;
  const params = new URLSearchParams(search);
  if (!params.has('tab')) return null;
  const requested = params.get('tab');
  const section: OverviewSection =
    requested === 'official' || requested === 'overall' ? requested : 'community';
  const allowed =
    section === 'official'
      ? ['page', 'platform']
      : section === 'community'
        ? ['page', 'metric', 'order', 'weapon', 'name']
        : [];
  const query = new URLSearchParams();
  for (const key of allowed) {
    const value = params.get(key);
    if (value !== null) query.set(key, value);
  }
  return overviewRoutes[section] + (query.size ? '?' + query : '');
}
