import { publicApiError } from './publicApiError';
import { useCallback, useEffect, useState } from 'react';
export type Metric = keyof typeof metricLabels;
export const metricLabels = {
  missions: 'Missions done',
  progression: 'Overall progression',
  healingOthersPerMission: 'Teammate healing per mission',
  revivesPerMission: 'Revives per mission',
  killsPerMission: 'Kills per mission',
  damagePerMission: 'Damage per mission',
  weaponKills: 'Weapon specialists',
  kills: 'Ridden killed',
  damage: 'Damage dealt',
  healing: 'Healing applied',
  revives: 'Cleaners revived',
  deaths: 'Deaths',
  caravanPurchases: 'Items purchased in caravan',
  ammoDropped: 'Ammo dropped',
  cardsPlayed: 'Cards played',
  treasureDoorsOpened: 'Treasure doors opened',
  hordesTriggered: 'Hordes triggered',
  snitchersSilenced: 'Snitchers silenced',
} as const;
export interface RefreshJob {
  gamertag: string;
  status: 'queued' | 'scheduled' | 'running' | 'completed' | 'failed' | 'cooldown' | 'retry_later';
  requestedAt: number;
  eligibleAt?: number;
  retryAt?: number;
}
export interface Player {
  gamertag: string;
  username: string;
  avatar?: string;
  platforms: string[];
  fetchedAt: string | null;
  stale: boolean;
  metrics: Record<Metric, number | null>;
  rank?: number;
  progression?: { completed: number; total: number; percentage: number } | null;
  refresh: { eligibleAt: string | null; job: RefreshJob | null };
}
export interface Ranking {
  results: Player[];
  total: number;
  page: number;
  totalPages: number;
  count: number;
  metric: Metric;
}
export interface BoardOptions {
  platforms: { code: string; label: string }[];
}
export class PlayerApiError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
  }
}
// Same-origin proxy avoids browser CORS and localhost IPv4/IPv6 ambiguity.
const base = (process.env.NEXT_PUBLIC_B4BSTATS_API_URL || '/api/game').replace(/\/$/, '');
export async function playerApi<T>(
  path: string,
  signal?: AbortSignal,
  method: 'GET' | 'POST' = 'GET',
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(base + path, { signal, method });
  } catch (e) {
    if (signal?.aborted) throw e;
    throw new PlayerApiError('The player service is temporarily unavailable.', 'UNAVAILABLE');
  }
  let body: any;
  try {
    body = await response.json();
  } catch {
    throw new PlayerApiError(
      'The player service returned an unreadable response.',
      'INVALID_RESPONSE',
    );
  }
  if (!response.ok) {
    const error = publicApiError(response.status, body.error?.code);
    throw new PlayerApiError(error.message, error.code);
  }
  return body as T;
}
export function usePlayerApi<T>(path: string | null) {
  const [state, setState] = useState<{ data: T | null; loading: boolean; error: string }>({
    data: null,
    loading: !!path,
    error: '',
  });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!path) {
      setState({ data: null, loading: false, error: '' });
      return;
    }
    const c = new AbortController();
    setState({ data: null, loading: true, error: '' });
    playerApi<T>(path, c.signal)
      .then((data) => {
        if (!c.signal.aborted) setState({ data, loading: false, error: '' });
      })
      .catch((error) => {
        if (!c.signal.aborted) setState({ data: null, loading: false, error: error.message });
      });
    return () => c.abort();
  }, [path, attempt]);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
export function number(value: number | null | undefined) {
  return value == null
    ? '—'
    : new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}
export function updated(date: string | null) {
  return date
    ? new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not collected yet';
}
export function playerHref(gamertag: string) {
  return '/player/' + encodeURIComponent(gamertag);
}
export interface PlayerStatsData {
  stats: Record<string, unknown>;
  profileCounters?: {
    supplyPoints?: { acquired?: number; spent?: number };
    skullTotemPoints?: { acquired?: number; spent?: number };
    consumables?: Record<string, { acquired?: number; spent?: number }>;
  };
}
export function asAnalyzerSave(data: PlayerStatsData) {
  return {
    offlineData: {
      stats: data.stats,
      supplyPoints: data.profileCounters?.supplyPoints,
      skullTotemPoints: data.profileCounters?.skullTotemPoints,
      consumables: data.profileCounters?.consumables,
    },
  };
}

export interface ProfileRankResponse {
  data: { rank: number | null; score: number | null } | null;
}

export interface WeaponTarget {
  id: string;
  kind: 'weapon' | 'category';
  label: string;
  translationKey: string;
}
