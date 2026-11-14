import { useTranslation } from 'react-i18next';
import { Badge, Divider } from '@mantine/core';
import type { ChartData, ChartOptions } from 'chart.js';
import StatisticsChart from '@components/common/StatisticsChart';
import { DifficultyColors, WeaponColors } from '@utils/colors';
import { Difficulties, WeaponsSorted, WeaponTypes } from '@components/statistics/types';
import { weaponToString } from '@translations/helpers';
import { nFormatter } from '@utils/generic';
import { useUI } from '@translations/useUI';
import type { OverallStatsResponse } from './OverallStats';

type Item = { id: string; label: string; value: number; share: number; color: string };

function DistributionChart({
  title,
  items,
  language,
  unit,
  doughnut = false,
}: {
  title: string;
  items: Item[];
  language?: string;
  unit: string;
  doughnut?: boolean;
}) {
  const tr = useUI();
  const number = new Intl.NumberFormat(language, { maximumFractionDigits: 2 });
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const data: ChartData = {
    labels: items.map((item) => item.label),
    datasets: [
      { data: items.map((item) => item.value), backgroundColor: items.map((item) => item.color) },
    ],
  };
  const options: ChartOptions = {
    indexAxis: doughnut ? 'x' : 'y',
    layout: { padding: doughnut ? 0 : { right: 40 } },
    ...(doughnut
      ? {}
      : {
          scales: {
            x: { beginAtZero: true, ticks: { color: '#fff' } },
            y: { ticks: { color: '#fff', autoSkip: false }, grid: { display: false } },
          },
        }),
    plugins: {
      legend: { display: doughnut, align: 'start', labels: { color: '#fff', boxWidth: 16 } },
      datalabels: {
        color: '#fff',
        anchor: doughnut ? 'center' : 'end',
        align: doughnut ? 'center' : 'end',
        display: (context) =>
          Number(context.dataset.data[context.dataIndex] ?? 0) > (doughnut ? total * 0.05 : 0),
        formatter: (value: number) => nFormatter(value, 1),
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          label: (context) => {
            const item = items[context.dataIndex];
            return `${number.format(item.value)} ${unit} (${number.format(item.share)}%)`;
          },
        },
      },
    },
  };
  if (!total)
    return (
      <figure aria-label={title}>
        <figcaption className="mb-2 text-sm font-bold">{title}</figcaption>
        <p className="text-sm text-muted">{tr('No statistics available yet.')}</p>
      </figure>
    );
  return (
    <StatisticsChart
      title={title}
      type={doughnut ? 'doughnut' : 'bar'}
      data={data}
      options={options}
      height={doughnut ? 360 : Math.max(260, items.length * 30 + 40)}
      fallbackContent={
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.label}: {number.format(item.value)} {unit} ({number.format(item.share)}%)
            </li>
          ))}
        </ul>
      }
      footer={
        <Badge>
          {tr('Total')}: {number.format(total)} {unit}
        </Badge>
      }
    />
  );
}

function weaponColor(translationKey: string) {
  const category = Object.entries(WeaponsSorted).find(([, weapons]) =>
    weapons.some((weapon) => `weapons.${weaponToString(weapon)}` === translationKey),
  );
  return category ? WeaponColors[category[0] as WeaponTypes] : '#d91205';
}

export default function OverallCharts({
  data,
  language,
}: {
  data: OverallStatsResponse['data'];
  language?: string;
}) {
  const { t } = useTranslation();
  const tr = useUI();
  const number = new Intl.NumberFormat(language, { maximumFractionDigits: 2 });
  const breakdown = data.missionBreakdown;
  const weaponTotal = data.weapons.reduce((sum, weapon) => sum + weapon.kills, 0);
  const categories: Item[] = data.weapons.map((weapon) => ({
    id: weapon.target,
    label: t(weapon.translationKey, { defaultValue: weapon.label }),
    value: weapon.kills,
    share: weaponTotal > 0 ? (weapon.kills / weaponTotal) * 100 : 0,
    color: WeaponColors[weapon.target.replace('category:', '') as WeaponTypes] ?? '#d91205',
  }));
  const acts = [
    ...new Map(breakdown?.completion.map((cell) => [cell.act, cell.label]) ?? []).entries(),
  ];
  const difficulties = [...new Set(breakdown?.completion.map((cell) => cell.difficulty) ?? [])];
  return (
    <div className="space-y-7 px-5 py-7 sm:px-7">
      {breakdown && (
        <>
          <Divider label={tr('Missions done')} labelPosition="center" variant="dashed" />
          <div className="grid gap-7 lg:grid-cols-2">
            <DistributionChart
              title={tr('Cleaner popularity')}
              language={language}
              unit={tr('missions')}
              items={breakdown.cleaners.map((cleaner) => ({
                id: cleaner.id,
                label: t(`cleaners.${cleaner.id}`),
                value: cleaner.missions,
                share: cleaner.share,
                color: '#d91205',
              }))}
            />
            <DistributionChart
              title={tr('Difficulty distribution')}
              language={language}
              unit={tr('missions')}
              items={breakdown.difficulties.map((difficulty) => ({
                id: difficulty.id,
                label: t(`difficulties.${difficulty.id}`),
                value: difficulty.missions,
                share: difficulty.share,
                color: DifficultyColors[difficulty.id as Difficulties],
              }))}
            />
          </div>
          <Divider label={tr('Overall progression')} labelPosition="center" variant="dashed" />
        </>
      )}
      {breakdown && (
        <section className="min-w-0" aria-label={tr('Completion by act and difficulty')}>
          <h3 className="text-sm font-bold">{tr('Completion by act and difficulty')}</h3>
          <p className="mt-2 mb-5 text-xs text-muted">
            {tr('Average unique completion across all 12 cleaners. Repeated clears count once.')}
          </p>
          <div className="overflow-x-auto">
            <table
              className="overall-heatmap w-full min-w-[510px] border-separate border-spacing-1 text-xs"
              aria-label={tr('Completion by act and difficulty')}
            >
              <thead>
                <tr>
                  <th scope="col" className="text-left">
                    {tr('Act')}
                  </th>
                  {difficulties.map((difficulty) => (
                    <th scope="col" key={difficulty} className="pb-2 font-normal text-muted">
                      {t(`difficulties.${difficulty}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {acts.map(([act, label]) => (
                  <tr key={act}>
                    <th scope="row" className="pr-3 text-left font-normal">
                      {act === 'hives'
                        ? tr('Hives')
                        : t(`acts.act_${act.slice(3)}`, { defaultValue: label })}
                    </th>
                    {difficulties.map((difficulty) => {
                      const value =
                        breakdown.completion.find(
                          (cell) => cell.act === act && cell.difficulty === difficulty,
                        )?.percentage ?? null;
                      return (
                        <td
                          key={difficulty}
                          className="rounded px-2 py-3 text-center tabular-nums"
                          style={{
                            backgroundColor:
                              value === null
                                ? undefined
                                : `rgba(217,18,5,${0.06 + (value / 100) * 0.84})`,
                          }}
                          title={`${label} · ${t(`difficulties.${difficulty}`)}: ${value === null ? '—' : number.format(value) + '%'}`}
                        >
                          {value === null ? '—' : number.format(value) + '%'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      <Divider label={tr('Recorded weapon kills')} labelPosition="center" variant="dashed" />
      <div className="grid gap-7 lg:grid-cols-2">
        <DistributionChart
          title={tr('Weapon category distribution')}
          language={language}
          unit={tr('kills')}
          doughnut
          items={categories}
        />
        {data.topWeapons && (
          <DistributionChart
            title={tr('Top 10 weapons')}
            language={language}
            unit={tr('kills')}
            items={data.topWeapons.map((weapon) => ({
              id: weapon.target,
              label: t(weapon.translationKey, { defaultValue: weapon.label }),
              value: weapon.kills,
              share: weapon.share ?? 0,
              color: weaponColor(weapon.translationKey),
            }))}
          />
        )}
      </div>
      <p className="text-xs text-muted">
        {tr(
          'Cleaner popularity uses recorded mission clears. Weapon popularity uses kills, not playtime.',
        )}
      </p>
    </div>
  );
}
