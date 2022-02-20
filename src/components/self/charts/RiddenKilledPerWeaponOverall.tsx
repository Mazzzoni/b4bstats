import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { ChartData, ChartOptions } from 'chart.js';
import { getSuggestedMaxFromArrayOfIntegers, nFormatter } from '@utils/generic';
import StatisticsState from '@components/self/StatisticsState';
import { WeaponsSorted, WeaponTypes } from '@components/statistics/types';
import Statistics from '@components/statistics/Statistics';
import { isSkippableWeaponInOverall, tooltipCallbackLabelKills } from '@utils/charts';
import { WeaponColors } from '@utils/colors';
import { weaponToString } from '@translations/helpers';

export default function RiddenKilledPerWeaponOverall() {
  const statistics = useRecoilValue(StatisticsState);
  const {t} = useTranslation();

  let counts: number[] = [];
  let labels: string[] = [];
  let backgroundColors: string[] = [];
  let overallKills = 0;

  for (const type in WeaponsSorted) {
    const weapons = Statistics.getWeaponsFromWeaponType(type);

    for (const weapon of weapons) {
      // We omit some weapons kill to not pollute graph
      if (isSkippableWeaponInOverall(weapon)) {
        continue;
      }

      overallKills += statistics.weaponsKills[weapon];
      labels.push(weaponToString(weapon));
      counts.push(statistics.weaponsKills[weapon]);
      backgroundColors.push(WeaponColors[type as unknown as WeaponTypes]);
    }
  }

  const data: ChartData = {
    labels: labels.map((weapon: string) => t(`weapons.${weapon}`)),
    datasets: [{
      data: counts,
      backgroundColor: backgroundColors,
    }],
  };

  const options: ChartOptions = {
    scales: {
      y: {
        suggestedMax: getSuggestedMaxFromArrayOfIntegers(counts),
      },
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value: number) => nFormatter(value),
      },
      tooltip: {
        callbacks: {
          label: (c) => tooltipCallbackLabelKills(c, overallKills, t)
        }
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