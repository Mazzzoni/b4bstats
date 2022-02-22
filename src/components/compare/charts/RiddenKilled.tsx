import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { useRecoilValue } from 'recoil';
import { Trans, useTranslation } from 'react-i18next';
import {
  localeFormat,
  getSumFromArrayOfIntegers,
  nFormatter
} from '@utils/generic';
import { Context } from 'chartjs-plugin-datalabels';
import PlayersStatisticsState from '@components/compare/PlayersStatisticsState';
import { PlayerColors } from '@utils/colors';
import { tooltipCallbackLabelKills } from '@utils/charts';
import { Riddens } from '@components/statistics/types';

export default function RiddenKilled() {
  const playersStatistics = useRecoilValue(PlayersStatisticsState);
  const {t} = useTranslation();

  let overallMutationsKilled = 0;
  let overallCommonsKilled = 0;
  let overallSleepersKilled = 0;
  let overallRiddenKilled = 0;
  let datasets = [];
  let i = 0;

  for (const playerStats of playersStatistics) {
    datasets.push({
      label: playerStats.player,
      data: Object.values(playerStats.stats.riddenKilled.specials),
      backgroundColor: PlayerColors[i],
    });

    overallMutationsKilled += getSumFromArrayOfIntegers(Object.values(playerStats.stats.riddenKilled.specials));
    overallCommonsKilled += playerStats.stats.riddenKilled.riddenCommonKilled;
    overallSleepersKilled += playerStats.stats.riddenKilled.riddenSleeperKilled;
    overallRiddenKilled += playerStats.stats.riddenKilled.riddenKilledTotal;

    i++;
  }

  const data: ChartData = {
    labels: Object.keys(playersStatistics[0].stats.riddenKilled.specials).map((type) => t(`mutations.${Riddens[type as unknown as number].toLowerCase()}`)),
    datasets: datasets
  };

  const options: ChartOptions = {
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        // Only show what above 0.02%
        display: (context: Context) => context.dataset.data[context.dataIndex]! > (overallMutationsKilled * 0.002),
        formatter: (value: number) => nFormatter(value, 1),
      },
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: (c) => tooltipCallbackLabelKills(c, overallMutationsKilled, t)
        },
      },
    },
  };

  return (
    <div>
      <strong>{t('graphs.ridden_killed')}</strong>
      <Chart data={data} options={options} type="bar"/>
      <p className="mt-3 text-sm">
        <Trans
          i18nKey="graphs.labels.commons_killed"
          values={{count: localeFormat(overallCommonsKilled)}}
          components={{b: <b/>}}
        /> |&nbsp;
        <Trans
          i18nKey="graphs.labels.mutations_killed"
          values={{count: localeFormat(overallMutationsKilled)}}
          components={{b: <b/>}}
        /> |&nbsp;
        <Trans
          i18nKey="graphs.labels.sleepers_killed"
          values={{count: localeFormat(overallSleepersKilled)}}
          components={{b: <b/>}}
        /> |&nbsp;
        <Trans
          i18nKey="graphs.labels.total_ridden_killed"
          values={{count: localeFormat(overallRiddenKilled)}}
          components={{b: <b/>}}
        />
      </p>
    </div>
  );
}