import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { useRecoilValue } from 'recoil';
import { Trans, useTranslation } from 'react-i18next';
import { ChartData, ChartOptions, ChartType, TooltipItem } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';
import { nFormatter } from '@utils/generic';
import StatisticsState from '@components/self/StatisticsState';
import Statistics from '@components/statistics/Statistics';
import { Weapons, WeaponTypes } from '@components/statistics/types';
import { WeaponColors } from '@utils/colors';
import { tooltipCallbackLabelKills } from '@utils/charts';
import { weaponToString, weaponTypeToString } from '@translations/helpers';
import { Badge } from '@mantine/core';

export default function RiddenKilledPerWeaponType() {
  const statistics = useRecoilValue(StatisticsState);
  const {t} = useTranslation();

  let counts: number[] = [];
  let backgroundColors: string[] = [];
  let overallTotal = 0;
  let biggestWeaponKillCount = 0;
  let biggestWeaponTypeKillCount = 0;
  let mostUsedWeaponType: WeaponTypes = WeaponTypes.Melee;
  let mostUsedWeapon: Weapons = Weapons.Fist;
  let mostUsedWeaponTypeBgColor = '#fff';
  let mostUsedWeaponBgColor = '#fff';

  for (const type in WeaponTypes) {
    const weapons = Statistics.getWeaponsFromWeaponType(type);

    let total = 0;

    for (const weapon of weapons) {
      const kills = statistics.weaponsKills[weapon];

      if (kills > biggestWeaponKillCount) {
        biggestWeaponKillCount = kills;
        mostUsedWeapon = weapon;
        mostUsedWeaponBgColor = WeaponColors[type as unknown as WeaponTypes];
      }

      total += kills;
    }

    if (total > biggestWeaponTypeKillCount) {
      biggestWeaponTypeKillCount = total;
      mostUsedWeaponType = type as WeaponTypes;
      mostUsedWeaponTypeBgColor = WeaponColors[type as unknown as WeaponTypes];
    }

    overallTotal += total;
    counts.push(total);
    backgroundColors.push(WeaponColors[type as unknown as WeaponTypes]);
  }

  const data: ChartData = {
    labels: Object.keys(WeaponTypes).map((type) => t(`weapons_types.${weaponTypeToString(type as WeaponTypes)}`)),
    datasets: [{
      data: counts,
      backgroundColor: backgroundColors,
    }],
  };

  const options: ChartOptions = {
    plugins: {
      datalabels: {
        anchor: 'center',
        align: 'center',
        // Only show value if superior to 8% of overall total
        display: (context: Context) => context.dataset.data[context.dataIndex]! > (overallTotal * 0.08),
        formatter: (value: number) => nFormatter(value, 1),
      },
      legend: {
        display: true,
        align: 'start',
        labels: {
          boxWidth: 16,
        },
      },
      tooltip: {
        callbacks: {
          title: (context: TooltipItem<ChartType>[]) => context[0].label,
          label: (c) => tooltipCallbackLabelKills(c, overallTotal, t),
        },
      },
    },
  };

  return (
    <div>
      <strong>{t('graphs.ridden_killed_per_weapon_type')}</strong>
      <Chart data={data} options={options} type="pie"/>
      <div className="mt-4">
        <Badge>
          <Trans
            i18nKey="graphs.labels.most_used_weapon_type"
            values={{type: t(`weapons_types.${weaponTypeToString(mostUsedWeaponType)}`)}}
            components={{b: <b style={{color: mostUsedWeaponTypeBgColor}}/>}}
          />
        </Badge>

        <br/>

        <Badge>
          <Trans
            i18nKey="graphs.labels.most_used_weapon"
            values={{weapon: t(`weapons.${weaponToString(mostUsedWeapon)}`)}}
            components={{b: <b style={{color: mostUsedWeaponBgColor}}/>}}
          />
        </Badge>
      </div>
    </div>
  );
}