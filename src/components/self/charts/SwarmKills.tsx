import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { useRecoilValue } from 'recoil';
import { localeFormat, getSuggestedMaxFromArrayOfIntegers, nFormatter } from '@utils/generic';
import { Trans, useTranslation } from 'react-i18next';
import { ChartData, ChartOptions } from 'chart.js';
import StatisticsState from '@components/self/StatisticsState';
import { tooltipCallbackLabelKills } from '@utils/charts';
import { Badge, Tooltip } from '@mantine/core';

export default function SwarmKills() {
  const statistics = useRecoilValue(StatisticsState);
  const {t} = useTranslation();

  const data: ChartData = {
    labels: [t('graphs.labels.kills_as_cleaner'), t('graphs.labels.kills_as_ridden')],
    datasets: [{
      data: [statistics.pvpStatistics.killsAsCleaner, statistics.pvpStatistics.killsAsRidden],
      backgroundColor: ['#46cb7c', '#ec2222'],
    }],
  };

  const options: ChartOptions = {
    scales: {
      y: {
        suggestedMax: getSuggestedMaxFromArrayOfIntegers([statistics.pvpStatistics.killsAsCleaner, statistics.pvpStatistics.killsAsRidden]),
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
          label: (c) => tooltipCallbackLabelKills(c, statistics.pvpStatistics.killsAsCleaner + statistics.pvpStatistics.killsAsRidden, t),
        },
      },
    },
  };

  return (
    <div>
      <strong>{t('graphs.swarm_kills')}</strong>
      <Chart data={data} options={options} type="bar"/>
      <div className="mt-3 flex space-x-2">
        <Badge mt={3}>
          <Trans
            i18nKey="graphs.labels.total_kills"
            values={{count: localeFormat(statistics.pvpStatistics.killsAsCleaner + statistics.pvpStatistics.killsAsRidden)}}
            components={{b: <b/>}}
          />
        </Badge>

        <Tooltip withArrow label="This is based on overall PVP games played">
          <Badge>
            Kill as cleaner APM: {statistics.getAverageValuePerPvpMissionCompleted(statistics.pvpStatistics.killsAsCleaner)}
          </Badge>
        </Tooltip>

        <Tooltip withArrow label="This is based on overall PVP games played">
          <Badge>
            Kill as ridden APM: {statistics.getAverageValuePerPvpMissionCompleted(statistics.pvpStatistics.killsAsRidden)}
          </Badge>
        </Tooltip>
      </div>
    </div>
  );
}