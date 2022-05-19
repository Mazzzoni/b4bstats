import { WeaponDefinition, WeaponQualities, WeaponStatisticsDefinition } from '@components/weapons/types';
import { useTranslation } from 'react-i18next';
import { WeaponColors, WeaponQualityColors } from '@utils/colors';
import { useRecoilValue } from 'recoil';
import SelectedQualityState from '@components/weapons/SelectedQualityState';
import { ChartData, ChartOptions } from 'chart.js';
import { getSuggestedMaxFromArrayOfIntegers, nFormatter } from '@utils/generic';
import { Chart } from 'react-chartjs-2';

type Props = {
  title: string;
  weapons: WeaponDefinition[];
  statisticCallback: (weapon: WeaponStatisticsDefinition) => number;
}

export default function OrderedWeaponsPerStatistic({title, weapons, statisticCallback}: Props) {
  const {t} = useTranslation();
  const selectedQuality = useRecoilValue(SelectedQualityState);

  let values: number[] = [];
  let labels: string[] = [];
  let qualities: string[] = [];
  let backgroundColors: string[] = [];

  for (const weapon of weapons) {
    const quality = Object.keys(weapon.qualities).includes(selectedQuality)
      ? selectedQuality
      // Take the latest weapon quality in set (best one normally)
      : Object.keys(weapon.qualities)[Object.keys(weapon.qualities).length - 1];

    const weaponQuality = weapon.qualities[quality as WeaponQualities];

    values.push(statisticCallback(weaponQuality));
    labels.push(weapon.name);
    qualities.push(quality);
    backgroundColors.push(WeaponColors[weapon.category]);
  }

  const data: ChartData = {
    labels: labels.map((weapon: string) => t(`weapons.${weapon}`)),
    datasets: [{
      data: values,
      backgroundColor: backgroundColors,
    }],
  };

  const options: ChartOptions = {
    scales: {
      y: {
        suggestedMax: getSuggestedMaxFromArrayOfIntegers(values),
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
          title: (tooltipItems) => {
            const tooltip = tooltipItems[0];

            return `${tooltip.label} (${qualities[tooltip.dataIndex]})`;
          },
        },
      },
    },
  };

  return (
    <div>
      <h3 className="text-1xl font-bold">{title} - <span className="capitalize" style={{color: WeaponQualityColors[selectedQuality]}}>{selectedQuality}</span></h3>

      <Chart data={data} options={options} type="bar"/>
    </div>
  );
}