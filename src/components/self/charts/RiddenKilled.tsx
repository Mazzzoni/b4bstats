import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { useRecoilValue } from 'recoil';
import { Trans, useTranslation } from 'react-i18next';
import {
  localeFormat,
  getSuggestedMaxFromArrayOfIntegers,
  getSumFromArrayOfIntegers,
  nFormatter
} from '@utils/generic';
import StatisticsState from '@components/self/StatisticsState';
import { tooltipCallbackLabelKills } from '@utils/charts';
import { RiddenColors } from '@utils/colors';
import { Riddens } from '@components/statistics/types';
import { Badge } from '@mantine/core';

export default function RiddenKilled() {
  const statistics = useRecoilValue(StatisticsState);
  const {t} = useTranslation();

  const data: ChartData = {
    labels: Object.keys(statistics.riddenKilled.specials).map((type) => t(`mutations.${Riddens[type as unknown as number].toLowerCase()}`)),
    datasets: [{
      data: Object.values(statistics.riddenKilled.specials),
      backgroundColor: Object.values(RiddenColors),
    }],
  };

  const totalSpecialRiddenKilled = getSumFromArrayOfIntegers(Object.values(statistics.riddenKilled.specials));

  const options: ChartOptions = {
    scales: {
      y: {
        suggestedMax: getSuggestedMaxFromArrayOfIntegers(Object.values(statistics.riddenKilled.specials)),
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
          label: (c) => tooltipCallbackLabelKills(c, totalSpecialRiddenKilled, t)
        },
      },
    },
  };

  return (
    <div>
      <strong>{t('graphs.ridden_killed')}</strong>
      <Chart data={data} options={options} type="bar"/>
      <div className="mt-3 flex space-x-2">
        <Badge>
          <Trans
            i18nKey="graphs.labels.commons_killed"
            values={{count: localeFormat(statistics.riddenKilled.riddenCommonKilled)}}
            components={{b: <b/>}}
          /> (APM: {statistics.getAverageValuePerMissionCompleted(statistics.riddenKilled.riddenCommonKilled)})
        </Badge>

        <Badge>
          <Trans
            i18nKey="graphs.labels.mutations_killed"
            values={{count: localeFormat(statistics.riddenKilled.riddenMutationsKilled)}}
            components={{b: <b/>}}
          /> (APM: {statistics.getAverageValuePerMissionCompleted(statistics.riddenKilled.riddenMutationsKilled)})
        </Badge>

        <Badge>
          <Trans
            i18nKey="graphs.labels.sleepers_killed"
            values={{count: localeFormat(statistics.riddenKilled.riddenSleeperKilled)}}
            components={{b: <b/>}}
          /> (APM: {statistics.getAverageValuePerMissionCompleted(statistics.riddenKilled.riddenSleeperKilled)})
        </Badge>

        <Badge>
          <Trans
            i18nKey="graphs.labels.total_ridden_killed"
            values={{count: localeFormat(statistics.riddenKilled.riddenKilledTotal)}}
            components={{b: <b/>}}
          /> (APM: {statistics.getAverageValuePerMissionCompleted(statistics.riddenKilled.riddenKilledTotal)})
        </Badge>
      </div>
    </div>
  );
}