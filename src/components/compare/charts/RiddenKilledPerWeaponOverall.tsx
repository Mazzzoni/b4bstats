import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { nFormatter } from '@utils/generic';
import { Context } from 'chartjs-plugin-datalabels';
import PlayersStatisticsState from '@components/compare/PlayersStatisticsState';
import { WeaponsSorted } from '@components/statistics/types';
import Statistics from '@components/statistics/Statistics';
import { isSkippableWeaponInOverall, tooltipCallbackLabelKills } from '@utils/charts';
import { PlayerColors } from '@utils/colors';
import { weaponToString } from '@translations/helpers';

export default function RiddenKilledPerWeaponOverall() {
  const playersStatistics = useRecoilValue(PlayersStatisticsState);
  const {t} = useTranslation();

  let overallKills = 0;
  let datasets = [];
  let labels: string[] = [];
  let i = 0;

  for (const playerStats of playersStatistics) {
    let counts: number[] = [];

    for (const type in WeaponsSorted) {
      const weapons = Statistics.getWeaponsFromWeaponType(type);

      for (const weapon of weapons) {
        if (isSkippableWeaponInOverall(weapon)) {
          continue;
        }

        // Only get the labels from the first player
        if (i === 0) {
          labels.push(weaponToString(weapon));
        }

        overallKills += playerStats.stats.weaponsKills[weapon];
        counts.push(playerStats.stats.weaponsKills[weapon]);
      }
    }

    datasets.push({
      label: playerStats.player,
      data: counts,
      backgroundColor: PlayerColors[i],
    });

    i++;
  }

  const data: ChartData = {
    labels: labels.map((weapon: string) => t(`weapons.${weapon}`)),
    datasets: datasets
  };

  const options: ChartOptions = {
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        // Only show what above 0.8%
        display: (context: Context) => context.dataset.data[context.dataIndex]! > (overallKills * 0.008),
        formatter: (value: number) => nFormatter(value, 1),
      },
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: (c) => tooltipCallbackLabelKills(c, overallKills, t)
        },
      },
    },
  };

  return (
    <div>
      <strong>{t('graphs.ridden_killed_per_weapon_overall')}</strong>
      <Chart data={data} options={options} type="bar"/>
    </div>
  );
}