import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { useRecoilValue } from 'recoil';
import { localeFormat, getSuggestedMaxFromArrayOfIntegers, nFormatter } from '@utils/generic';
import { Trans, useTranslation } from 'react-i18next';
import { ChartData, ChartOptions } from 'chart.js';
import StatisticsState from '@components/self/StatisticsState';
import Statistics from '@components/statistics/Statistics';
import { Weapons, WeaponTypes } from '@components/statistics/types';
import { isSkippableWeaponInOverall, tooltipCallbackLabelKills } from '@utils/charts';
import { WeaponColors } from '@utils/colors';
import { weaponToString } from '@translations/helpers';
import { Badge } from '@mantine/core';

type Props = {
  title: string
  type: WeaponTypes
}

export default function RiddenKilledPerWeaponTypeSet({title, type}: Props) {
  const statistics = useRecoilValue(StatisticsState);
  const {t} = useTranslation();
  const weapons = Statistics.getWeaponsFromWeaponType(type);

  let counts: number[] = [];
  let labels: string[] = [];
  let total = 0;
  let overallKillSet = 0;

  for (const weapon of weapons) {
    // We omit some weapons kill to not pollute graph
    if (isSkippableWeaponInOverall(weapon)) {
      continue;
    }

    overallKillSet += statistics.weaponsKills[weapon];
    labels.push(weaponToString(weapon));
    counts.push(statistics.weaponsKills[weapon]);
    total += statistics.weaponsKills[weapon];
  }

  const data: ChartData = {
    labels: labels.map((weapon: string) => t(`weapons.${weapon}`)),
    datasets: [{
      label: 'Kills',
      data: counts,
      backgroundColor: WeaponColors[type],
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
        formatter: (value: number) => nFormatter(value, 1),
      },
      tooltip: {
        callbacks: {
          label: (c) => tooltipCallbackLabelKills(c, overallKillSet, t)
        },
      },
    },
  };

  if (type === WeaponTypes.Melee) {
    total += statistics.weaponsKills[Weapons.Fist];
    total += statistics.weaponsKills[Weapons.BobArm];
    total += statistics.weaponsKills[Weapons.SkullTotem];
  }

  return (
    <div>
      <strong>{title}</strong>
      <Chart data={data} options={options} type="bar"/>

      {type === WeaponTypes.Melee && (
        <div className="mt-3">
          <Badge>
            <Trans
              i18nKey="graphs.labels.ridden_killed_fist"
              values={{count: localeFormat(statistics.weaponsKills[Weapons.Fist])}}
              components={{b: <b/>}}
            />
          </Badge>

          <br/>

          <Badge>
            <Trans
              i18nKey="graphs.labels.ridden_killed_bob_arm"
              values={{count: localeFormat(statistics.weaponsKills[Weapons.BobArm])}}
              components={{b: <b/>}}
            />
          </Badge>

          <br/>

          <Badge>
            <Trans
              i18nKey="graphs.labels.ridden_killed_skull_totem"
              values={{count: localeFormat(statistics.weaponsKills[Weapons.SkullTotem])}}
              components={{b: <b/>}}
            />
          </Badge>
        </div>
      )}

      <div className="mt-3">
        <Badge>
          <Trans
            i18nKey="graphs.labels.total_ridden_killed"
            values={{count: localeFormat(total)}}
            components={{b: <b/>}}
          />
        </Badge>
      </div>
    </div>
  );
}