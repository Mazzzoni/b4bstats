import { useRouter } from 'next/router';
import { useUI } from '@translations/useUI';
import OverallCharts from './OverallCharts';
import { metricLabels, type Metric } from '@utils/playerApi';

interface Statistic {
  total: number | null;
  average: number | null;
  median?: number | null;
  perMission: number | null;
  players: number;
}
export interface OverallWeapon {
  target: string;
  label: string;
  translationKey: string;
  kills: number;
  players: number;
  average: number;
  share?: number;
}
export interface MissionBreakdown {
  players: number;
  cleaners: { id: string; missions: number; share: number }[];
  difficulties: { id: string; missions: number; share: number }[];
  completion: { act: string; label: string; difficulty: string; percentage: number | null }[];
}
export interface OverallStatsResponse {
  data: {
    players: number;
    lastCollectedAt: string | null;
    metrics: Partial<Record<Metric, Statistic>>;
    progression: {
      players: number;
      averagePercentage: number | null;
      fullyCompletedPlayers: number;
      medianPercentage?: number | null;
    };
    weapons: OverallWeapon[];
    topWeapons?: OverallWeapon[];
    missionBreakdown?: MissionBreakdown;
  };
  updatedAt?: string;
  meta?: { computedAt: string }; // Compatibility with the API during deployment.
}

export default function OverallStats({ response }: { response: OverallStatsResponse }) {
  const tr = useUI();

  const { locale } = useRouter();
  const language = locale === 'default' ? 'en' : locale;
  const formatter = new Intl.NumberFormat(language, { maximumFractionDigits: 2 });
  const format = (value: number | null | undefined) =>
    value == null ? '—' : formatter.format(value);
  const { data } = response;
  const updatedAt = response.updatedAt ?? response.meta?.computedAt ?? data.lastCollectedAt;
  if (!data.players) return <div className="players-state">{tr('No collected profiles yet.')}</div>;
  return (
    <div className="overall-stats">
      <div className="border-b border-line px-5 py-5 sm:px-7">
        <h2 className="text-xl font-bold">{tr('Overall stats')}</h2>
        <p className="mt-2 text-xs text-muted">
          {tr('Updated')}{' '}
          {updatedAt
            ? new Intl.DateTimeFormat(language, { dateStyle: 'medium' }).format(new Date(updatedAt))
            : '—'}
        </p>
      </div>
      <dl className="players-section-summary !border-t-0 border-b sm:!grid-cols-2 xl:!grid-cols-4">
        <div>
          <dt className="text-xs text-muted">{tr('Average progression')}</dt>
          <dd className="tabular-nums">
            {data.progression.averagePercentage === null
              ? '—'
              : format(data.progression.averagePercentage) + '%'}
          </dd>
          <dd className="mt-1 text-xs text-muted">
            {tr('Players counted')}: {format(data.progression.players)}
          </dd>
        </div>
        {[
          { label: 'Median progression', value: data.progression.medianPercentage, suffix: '%' },
          { label: 'Median missions', value: data.metrics.missions?.median, suffix: '' },
          { label: 'Median kills', value: data.metrics.kills?.median, suffix: '' },
        ].map(({ label, value, suffix }) => (
          <div key={label}>
            <dt className="text-xs text-muted">{tr(label)}</dt>
            <dd className="tabular-nums">
              {format(value)}
              {value == null ? '' : suffix}
            </dd>
          </div>
        ))}
      </dl>
      <p className="px-5 pt-4 text-xs text-muted sm:px-7">
        {tr('Median: the middle value, less affected by extreme totals.')}
      </p>
      <OverallCharts data={data} language={language} />
      <details className="border-t border-line">
        <summary className="cursor-pointer px-5 py-5 font-semibold sm:px-7">
          {tr('Detailed statistics')}
        </summary>
        <div className="players-table-wrap">
          <table className="players-table" aria-label={tr('Overall stats')}>
            <thead>
              <tr>
                <th>{tr('Statistic')}</th>
                <th>{tr('Total')}</th>
                <th>{tr('Average per player')}</th>
                <th>{tr('Median')}</th>
                <th>{tr('Average per mission')}</th>
                <th>{tr('Players counted')}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.metrics).map(([key, statistic]) => (
                <tr key={key}>
                  <th scope="row">{tr(metricLabels[key as Metric])}</th>
                  <td>{format(statistic.total)}</td>
                  <td>{format(statistic.average)}</td>
                  <td>{format(statistic.median)}</td>
                  <td>{format(statistic.perMission)}</td>
                  <td>{format(statistic.players)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-b border-line px-5 py-4 text-xs text-muted sm:px-7">
          {tr(
            'Averages use available player data; per-mission averages use matching mission totals.',
          )}
        </p>
      </details>
    </div>
  );
}
