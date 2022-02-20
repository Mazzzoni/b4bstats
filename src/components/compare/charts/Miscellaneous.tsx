import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { useRecoilValue } from 'recoil';
import {
  getSuggestedMaxFromArrayOfIntegers,
  getSumFromArrayOfIntegers,
  nFormatter
} from '@utils/generic';
import PlayersStatisticsState from '@components/compare/PlayersStatisticsState';
import { MiscellaneousStatistics } from '@components/statistics/types';
import { PlayerColors } from '@utils/colors';
import { tooltipCallbackLabelPlain } from '@utils/charts';

type Props = {
  miscellaneousStatistic: MiscellaneousStatistics
  title: string
}

export default function Miscellaneous({miscellaneousStatistic, title}: Props) {
  const playersStatistics = useRecoilValue(PlayersStatisticsState);
  const playersData = playersStatistics.map((playerStats) => playerStats.stats.miscellaneousStatistics[miscellaneousStatistic]);
  const playersDataSum = getSumFromArrayOfIntegers(playersData);
  const playersNames = playersStatistics.map((playerStats) => playerStats.player);

  const data: ChartData = {
    labels: playersNames,
    datasets: [{
      data: playersData,
      backgroundColor: PlayerColors,
    }],
  };

  const options: ChartOptions = {
    scales: {
      y: {
        suggestedMax: getSuggestedMaxFromArrayOfIntegers(playersData),
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
          label: (c) => tooltipCallbackLabelPlain(c, playersDataSum)
        }
      },
    },
  };

  return (
    <div className="mb-5">
      <strong>{title}</strong>
      <Chart data={data} options={options} type="bar"/>
    </div>
  );
}