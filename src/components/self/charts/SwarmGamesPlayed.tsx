import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { useRecoilValue } from 'recoil';
import { localeFormat, getSuggestedMaxFromArrayOfIntegers, nFormatter } from '@utils/generic';
import { Trans, useTranslation } from 'react-i18next';
import { ChartData, ChartOptions } from 'chart.js';
import StatisticsState from '@components/self/StatisticsState';
import { tooltipCallbackLabelPlain } from '@utils/charts';
import { Badge } from '@mantine/core';

export default function SwarmGamesPlayed() {
  const statistics = useRecoilValue(StatisticsState);
  const {t} = useTranslation();

  const data: ChartData = {
    labels: [t('graphs.labels.wins'), t('graphs.labels.losses')],
    datasets: [{
      data: [statistics.pvpStatistics.gamesWon, statistics.pvpStatistics.gamesLost],
      backgroundColor: ['#46cb7c', '#ec2222'],
    }],
  };

  const options: ChartOptions = {
    scales: {
      y: {
        suggestedMax: getSuggestedMaxFromArrayOfIntegers([statistics.pvpStatistics.gamesWon, statistics.pvpStatistics.gamesLost]),
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
          label: (c) => tooltipCallbackLabelPlain(c, statistics.pvpStatistics.gamesPlayed)
        }
      },
    },
  };

  return (
    <div>
      <strong>{t('graphs.swarm_games_played')}</strong>
      <Chart data={data} options={options} type="bar"/>
      <div className="mt-3 flex space-x-2">
        <Badge>
          <Trans
            i18nKey="graphs.labels.total_games_played"
            values={{count: localeFormat(statistics.pvpStatistics.gamesPlayed)}}
            components={{b: <b/>}}
          />
        </Badge>

        <Badge>
          <Trans
            i18nKey="graphs.labels.ratio"
            values={{ratio: (statistics.pvpStatistics.gamesWon / statistics.pvpStatistics.gamesLost).toFixed(2)}}
            components={{b: <b/>}}
          />
        </Badge>
      </div>
    </div>
  );
}