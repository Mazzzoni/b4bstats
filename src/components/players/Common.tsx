import { useUI } from '@translations/useUI';
import Link from 'next/link';
import { rankingColumns, isEfficiencyMetric } from '@utils/communityRankings';
import { useRouter } from 'next/router';
import { Player, Metric, Ranking, metricLabels, number, playerHref } from '@utils/playerApi';
import { ArrowRight, AlertCircle, RefreshCw } from 'react-feather';
export function PlayerAvatar({
  player,
  large = false,
}: {
  player: {
    avatar?: string;
    gamertag: string;
  };
  large?: boolean;
}) {
  return (
    <span className={'players-avatar ' + (large ? 'players-avatar-large' : '')}>
      {player.avatar ? (
        <img
          src={player.avatar}
          alt=""
          referrerPolicy="no-referrer"
          loading="lazy"
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        player.gamertag.slice(0, 1).toUpperCase()
      )}
    </span>
  );
}
export function ErrorState({
  message,
  retry,
  retryOnly = false,
}: {
  message: string;
  retry?: () => void;
  retryOnly?: boolean;
}) {
  return (
    <div className="players-state players-error" role="alert">
      {!retryOnly && <AlertCircle size={22} />}
      <div>
        {!retryOnly && (
          <>
            <strong>Couldn’t load this view</strong>
            <p>{message}</p>
          </>
        )}
        {retry && (
          <button className="players-text-button" onClick={retry}>
            <RefreshCw size={14} /> Try again
          </button>
        )}
      </div>
    </div>
  );
}
export function LoadingState({ label = 'Loading player data…' }: { label?: string }) {
  return (
    <div className="players-state" role="status">
      <RefreshCw size={18} className="players-spin" />
      {label}
    </div>
  );
}
export function MetricCards({ player }: { player: Player }) {
  const tr = useUI();
  return (
    <div className="players-metrics">
      {(['missions', 'kills', 'damage', 'healing', 'revives', 'deaths'] as Metric[]).map((key) => (
        <div className="players-metric" key={key}>
          <span>{tr(metricLabels[key])}</span>
          <strong>{number(player.metrics[key])}</strong>
        </div>
      ))}
    </div>
  );
}
export function RankNumber({ rank }: { rank?: number | null }) {
  return (
    <span className={'players-rank ' + (rank === 1 ? 'players-rank-first' : '')}>
      {rank == null ? '—' : `#${number(rank)}`}
    </span>
  );
}
export function RankingTable({
  ranking,
  selected = 'kills',
  weaponLabel,
  compact = false,
  order = 'desc',
  onSort,
}: {
  ranking: Ranking;
  selected?: Metric;
  weaponLabel?: string;
  compact?: boolean;
  order?: 'asc' | 'desc';
  onSort?: (metric: Metric) => void;
}) {
  const tr = useUI();
  const { locale } = useRouter();
  const columns: Metric[] = compact ? [selected] : rankingColumns(selected);
  const columnLabel = (key: Metric) =>
    key === 'weaponKills' && weaponLabel
      ? `${tr('Weapon kills')}: ${weaponLabel}`
      : tr(metricLabels[key]);
  if (!ranking.results.length)
    return (
      <div className="players-state">
        <div>
          <strong>
            {isEfficiencyMetric(selected) || selected === 'weaponKills'
              ? tr('No eligible players yet.')
              : 'No players here yet.'}
          </strong>
          <p>
            Look up a player and open their profile to add their available stats to this collection.
          </p>
          <Link href="/" className="players-text-button">
            Find a player <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  return (
    <div className="players-table-wrap">
      <table className={'players-table ' + (compact ? 'players-table-compact' : '')}>
        <thead>
          <tr>
            <th scope="col">{tr('Rank')}</th>
            <th scope="col">{tr('Cleaner')}</th>
            {columns.map((k) => (
              <th
                scope="col"
                key={k}
                aria-sort={
                  k === selected ? (order === 'desc' ? 'descending' : 'ascending') : 'none'
                }
                className={k === selected ? 'players-selected-column' : ''}
              >
                {onSort ? (
                  <button className="ranking-sort" onClick={() => onSort(k)}>
                    {columnLabel(k)}{' '}
                    <span aria-hidden="true">
                      {k === selected ? (order === 'desc' ? '↓' : '↑') : '↕'}
                    </span>
                  </button>
                ) : (
                  columnLabel(k)
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ranking.results.map((p) => (
            <tr key={p.gamertag}>
              <td>
                <RankNumber rank={p.rank} />
              </td>
              <td>
                <Link href={playerHref(p.gamertag)} className="players-person">
                  <PlayerAvatar player={p} />
                  <span>
                    <strong>{p.gamertag}</strong>
                  </span>
                </Link>
              </td>
              {columns.map((k) => (
                <td key={k} className={k === selected ? 'players-selected-column' : ''}>
                  {k === 'progression' && p.progression ? (
                    <div className="ranking-progression ml-auto w-fit min-w-36">
                      <strong>
                        {new Intl.NumberFormat(locale === 'default' ? 'en' : locale, {
                          maximumFractionDigits: 1,
                        }).format(Math.floor(p.progression.percentage * 10) / 10)}
                        %
                      </strong>
                      <span className="ml-2 text-xs text-muted">
                        {number(p.progression.completed)} / {number(p.progression.total)}
                      </span>
                      <progress
                        className="mt-2 block h-1 w-full accent-brand"
                        value={p.progression.completed}
                        max={p.progression.total}
                        aria-label={`${tr('Overall progression')}: ${p.gamertag}`}
                      />
                    </div>
                  ) : isEfficiencyMetric(k) && p.metrics[k] != null ? (
                    new Intl.NumberFormat(locale === 'default' ? 'en' : locale, {
                      maximumFractionDigits: 2,
                    }).format(p.metrics[k]!)
                  ) : (
                    number(p.metrics[k])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
