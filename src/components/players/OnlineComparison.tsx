import { useCallback, useEffect, useRef, useState } from 'react';
import { Provider, useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/router';
import PlayersStatisticsState, {
  PlayersStatistics,
} from '@components/compare/PlayersStatisticsState';
import Statistics from '@components/statistics/Statistics';
import Display from '@components/compare/Display';
import PlayerSearch from './PlayerSearch';
import { ErrorState, LoadingState } from './Common';
import {
  Player,
  PlayerStatsData,
  Ranking,
  asAnalyzerSave,
  playerApi,
  usePlayerApi,
} from '@utils/playerApi';
interface Selection extends PlayersStatistics {
  id: string;
}
function Charts({ players, onReady }: { players: Selection[]; onReady: () => void }) {
  const setPlayers = useSetAtom(PlayersStatisticsState);
  const loaded = useAtomValue(PlayersStatisticsState);
  useEffect(() => {
    setPlayers(players);
  }, [players, setPlayers]);
  useEffect(() => {
    if (loaded.length >= 2) onReady();
  }, [loaded, onReady]);
  return loaded.length >= 2 ? <Display /> : <LoadingState />;
}
export default function OnlineComparison() {
  const router = useRouter();
  const [selected, setSelected] = useState<Selection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [comparisonRun, setComparisonRun] = useState(0);
  const scrollFrame = useRef(0);
  const scrollToResults = useCallback(() => {
    cancelAnimationFrame(scrollFrame.current);
    scrollFrame.current = requestAnimationFrame(() =>
      resultsRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
        block: 'start',
      }),
    );
  }, []);
  useEffect(() => () => cancelAnimationFrame(scrollFrame.current), []);
  useEffect(() => {
    if (show && resultsRef.current?.querySelector('canvas')) scrollToResults();
  }, [show, comparisonRun, scrollToResults]);
  const active = useRef(false);
  const request = useRef<AbortController | null>(null);
  const roster = usePlayerApi<{ data: Ranking }>('/community/leaderboards?metric=missions&count=5');
  useEffect(
    () => () => {
      if (request.current) request.current.abort();
    },
    [],
  );
  const add = useCallback(
    async (id: string) => {
      if (active.current || selected.some((p) => p.id === id) || selected.length >= 4) return;
      active.current = true;
      setLoading(true);
      setError('');
      setShow(false);
      const controller = new AbortController();
      request.current = controller;
      try {
        const summary = await playerApi<{ data: Player | null }>(
          '/players/' + encodeURIComponent(id),
          controller.signal,
        );
        const player = summary.data;
        if (!player)
          throw new Error(
            'This profile is queued for collection. Open it from Players, then compare it once collection completes.',
          );
        const save = await playerApi<{ data: PlayerStatsData }>(
          '/players/' + encodeURIComponent(id) + '/stats',
          controller.signal,
        );
        const stats = Statistics.build(asAnalyzerSave(save.data));
        if (!controller.signal.aborted)
          setSelected((players) =>
            players.some((p) => p.id === id)
              ? players
              : [...players, { id, player: player.gamertag, stats }].slice(0, 4),
          );
      } catch (e) {
        if (!controller.signal.aborted) setError((e as Error).message);
      } finally {
        active.current = false;
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [selected],
  );
  const initial = typeof router.query.with === 'string' ? router.query.with : '';
  useEffect(() => {
    if (!router.isReady || !/^.+#[0-9]{3,8}$/.test(initial)) return;
    const controller = new AbortController();
    setLoading(true);
    setError('');
    (async () => {
      try {
        const summary = await playerApi<{ data: Player | null }>(
          '/players/' + encodeURIComponent(initial),
          controller.signal,
        );
        if (!summary.data)
          throw new Error('This profile is waiting to be collected. Open it from Players first.');
        const player = summary.data;
        const response = await playerApi<{ data: PlayerStatsData }>(
          '/players/' + encodeURIComponent(initial) + '/stats',
          controller.signal,
        );
        const stats = Statistics.build(asAnalyzerSave(response.data));
        if (!controller.signal.aborted)
          setSelected((players) =>
            players.some((p) => p.id === initial)
              ? players
              : [...players, { id: initial, player: player.gamertag, stats }].slice(0, 4),
          );
      } catch (error) {
        if (!controller.signal.aborted) setError((error as Error).message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [router.isReady, initial]);
  return (
    <div className="players-app">
      <div className="players-notice">
        <strong>Compare up to four online profiles.</strong> Add players by tag, then compare their
        available stats.
      </div>
      <div className="players-comparison-picks">
        {selected.map((p) => (
          <div key={p.id}>
            <strong>{p.player}</strong>
            <button
              onClick={() => {
                setSelected(selected.filter((other) => other.id !== p.id));
                setShow(false);
              }}
              aria-label={'Remove ' + p.player}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {selected.length < 4 && <PlayerSearch onSelect={(p) => void add(p.gamertag)} />}
      <div className="players-comparison-toolbar">
        <button
          className="players-button"
          disabled={selected.length < 2 || loading}
          onClick={() => {
            setShow(true);
            setComparisonRun((value) => value + 1);
          }}
        >
          Compare {selected.length} players →
        </button>
        <span>{selected.length}/4 selected</span>
      </div>
      {roster.data && selected.length < 4 && (
        <div className="players-comparison-suggestions">
          <span>Or add from the collected roster:</span>
          {roster.data.data.results
            .filter((p) => !selected.some((s) => s.id === p.gamertag))
            .map((p) => (
              <button
                className="players-text-button"
                key={p.gamertag}
                disabled={loading}
                onClick={() => void add(p.gamertag)}
              >
                + {p.gamertag}
              </button>
            ))}
        </div>
      )}
      {loading && <LoadingState label="Loading player for comparison…" />}
      {error && <ErrorState message={error} />}{' '}
      {show && selected.length >= 2 && (
        <div ref={resultsRef} id="comparison-results" className="mt-6">
          <Provider>
            <Charts players={selected} onReady={scrollToResults} />
          </Provider>
        </div>
      )}
    </div>
  );
}
