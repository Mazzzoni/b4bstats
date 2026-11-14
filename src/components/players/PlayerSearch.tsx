import { useUI } from '@translations/useUI';
import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Autocomplete } from '@mantine/core';
import { Search, ArrowRight } from 'react-feather';
import { playerApi, playerHref } from '@utils/playerApi';
import { ErrorState, LoadingState } from './Common';
export interface Match {
  gamertag: string;
  avatar?: string;
  platforms: string[];
}
export default function PlayerSearch({
  compact = false,
  onSelect,
}: {
  compact?: boolean;
  onSelect?: (player: Match) => void;
}) {
  const tr = useUI();
  const router = useRouter();
  const knownPlayers = useRef(new Map<string, Match>());
  const [suggestions, setSuggestions] = useState<Match[]>([]);
  const [username, setUsername] = useState('');
  const [results, setResults] = useState<Match[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const request = useRef<AbortController | null>(null);
  useEffect(
    () => () => {
      if (request.current) request.current.abort();
    },
    [],
  );
  useEffect(() => {
    setSuggestions([]);
    if (username.trim().length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      playerApi<{ data: { results: Match[] } }>(
        '/players/suggestions?query=' + encodeURIComponent(username.trim()),
        controller.signal,
      )
        .then((response) => {
          if (!controller.signal.aborted) {
            setSuggestions(response.data.results);
            if (knownPlayers.current.size > 100) knownPlayers.current.clear();
            for (const player of response.data.results)
              knownPlayers.current.set(player.gamertag.toLowerCase(), player);
          }
        })
        .catch(() => {
          /* Suggestions are optional; explicit search stays available. */
        });
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [username]);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!username.trim()) return;
    const known = knownPlayers.current.get(username.trim().toLowerCase());
    if (known) {
      if (onSelect) {
        onSelect(known);
        setUsername('');
        setResults(null);
      } else await router.push(playerHref(known.gamertag));
      return;
    }
    if (request.current) request.current.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const response = await playerApi<{
        data: {
          results: Match[];
        };
      }>('/players/search?username=' + encodeURIComponent(username.trim()), controller.signal);
      if (!controller.signal.aborted) {
        setResults(response.data.results);
      }
    } catch (e) {
      if (!controller.signal.aborted) setError((e as Error).message);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }
  return (
    <div className={'players-search ' + (compact ? 'players-search-compact' : '')}>
      <form onSubmit={submit}>
        <div className="players-search-input">
          <Search size={20} aria-hidden="true" />
          <Autocomplete
            id={compact ? 'tag-home' : 'tag-search'}
            value={username}
            onChange={setUsername}
            data={suggestions.map((player) => player.gamertag)}
            limit={8}
            placeholder={tr('Enter a player tag, e.g. Cleaner#1234')}
            maxLength={100}
            autoComplete="off"
            required
            className="min-w-0 flex-1"
            aria-label={tr('Player tag')}
          />
          <button className="players-button" type="submit" disabled={loading}>
            {tr(loading ? 'Searching…' : 'Find player')}
            <ArrowRight size={17} />
          </button>
        </div>
        <p className="players-hint">
          {tr('Use the full in-game tag, including # and the digits. PC, PlayStation & Xbox.')}
        </p>
      </form>
      {loading && <LoadingState label={tr('Searching…')} />}
      {error && <ErrorState message={error} />}
      <div aria-live="polite">
        {results && (
          <div className="players-search-results">
            <div className="players-section-label">
              {results.length ? 'SELECT A PLAYER' : 'NO MATCHING PLAYERS'}
            </div>
            {!results.length && <p>Check the spelling and include the digits after #.</p>}
            {results.map((p) => (
              <Link
                key={p.gamertag}
                href={playerHref(p.gamertag)}
                className="players-search-result"
                onClick={(event) => {
                  if (onSelect) {
                    event.preventDefault();
                    onSelect(p);
                    setResults(null);
                    setUsername('');
                  }
                }}
              >
                <span className="players-avatar">{(p.gamertag || '?').slice(0, 1)}</span>
                <span>
                  <strong>{p.gamertag}</strong>
                  <small>{p.platforms.join(' · ').toUpperCase() || 'Back 4 Blood'}</small>
                </span>
                <span className="players-result-action">
                  {onSelect ? 'Add player' : 'View profile'} <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
