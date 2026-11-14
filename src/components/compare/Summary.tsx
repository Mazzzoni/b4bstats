import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import PlayersStatisticsState from './PlayersStatisticsState';
import type Statistics from '@components/statistics/Statistics';
import {
  Cleaners,
  Difficulties,
  MiscellaneousStatistics,
  ProgressionTypes,
  WeaponsSorted,
  WeaponTypes,
} from '@components/statistics/types';
import { comparisonCompletion, perMission } from '@utils/comparison';
import { weaponTypeToString } from '@translations/helpers';
import { useUI } from '@translations/useUI';

type Row = { label: string; value: (statistics: Statistics) => number | string | null };

export default function Summary() {
  const players = useAtomValue(PlayersStatisticsState);
  const { t, i18n } = useTranslation();
  const tr = useUI();
  const format = new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 });
  const missions = (statistics: Statistics) =>
    statistics.missionsStatistics[ProgressionTypes.Merged];
  const rate = (statistic: MiscellaneousStatistics) => (statistics: Statistics) =>
    perMission(
      statistics.miscellaneousStatistics[statistic],
      missions(statistics).missionsCompleted,
    );
  const sections: { title: string; rows: Row[] }[] = [
    {
      title: tr('Totals and progression'),
      rows: [
        {
          label: tr('Missions done'),
          value: (statistics) => missions(statistics).missionsCompleted,
        },
        {
          label: tr('Overall progression'),
          value: (statistics) => {
            const { completed, total } = comparisonCompletion(statistics);
            return `${format.format(completed)} / ${format.format(total)} (${format.format((completed / total) * 100)}%)`;
          },
        },
        ...Object.values(Difficulties).map((difficulty) => ({
          label: t(`difficulties.${difficulty}`),
          value: (statistics: Statistics) =>
            missions(statistics).missionsCompletedPerDifficulty[difficulty],
        })),
      ],
    },
    {
      title: tr('Average per mission'),
      rows: [
        {
          label: tr('Ridden killed'),
          value: (statistics) =>
            perMission(
              statistics.riddenKilled.riddenKilledTotal,
              missions(statistics).missionsCompleted,
            ),
        },
        { label: tr('Damage dealt'), value: rate(MiscellaneousStatistics.EnemyDamageInflicted) },
        { label: tr('Teammate healing'), value: rate(MiscellaneousStatistics.HealingAppliedOther) },
        { label: tr('Cleaners revived'), value: rate(MiscellaneousStatistics.CleanersRevived) },
        { label: tr('Deaths'), value: rate(MiscellaneousStatistics.TimesDiedAsCleaner) },
      ],
    },
    {
      title: tr('Missions by cleaner'),
      rows: Object.values(Cleaners).map((cleaner) => ({
        label: t(`cleaners.${cleaner}`),
        value: (statistics) => missions(statistics).missionsCompletedPerCleaner[cleaner].total,
      })),
    },
    {
      title: tr('Recorded weapon kills'),
      rows: Object.entries(WeaponsSorted).map(([type, weapons]) => ({
        label: t(`weapons_types.${weaponTypeToString(type as WeaponTypes)}`),
        value: (statistics) =>
          weapons.reduce((sum, weapon) => sum + statistics.weaponsKills[weapon], 0),
      })),
    },
  ];

  return (
    <div className="space-y-8">
      {sections.map(({ title, rows }) => (
        <section key={title} aria-label={title}>
          <h2 className="mb-4 text-2xl font-bold">{title}</h2>
          <div className="overflow-x-auto">
            <table className="comparison-table w-full text-sm">
              <thead>
                <tr>
                  <th scope="col">{tr('Statistic')}</th>
                  {players.map(({ player }) => (
                    <th scope="col" key={player}>
                      {player}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ label, value }) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    {players.map(({ player, stats }) => {
                      const result = value(stats);
                      return (
                        <td key={player}>
                          {result === null
                            ? '—'
                            : typeof result === 'number'
                              ? format.format(result)
                              : result}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
