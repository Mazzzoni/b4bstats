import StatisticsChart from '@components/common/StatisticsChart';
import { useAtomValue } from 'jotai';
import { nFormatter } from '@utils/generic';
import { useTranslation } from 'react-i18next';
import { ChartData, ChartOptions, ChartType, TooltipItem } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';
import StatisticsState from '@components/self/StatisticsState';
import { tooltipCallbackLabelMissions } from '@utils/charts';
import { Difficulties } from '@components/statistics/types';
import { DifficultyColors } from '@utils/colors';
import SelectedProgressionTypeState from '@components/self/SelectedProgressionTypeState';

export default function MissionsCompletedPerDifficulty() {
  const statistics = useAtomValue(StatisticsState);
  const progressionType = useAtomValue(SelectedProgressionTypeState);
  const { t } = useTranslation();

  const entries = Object.entries(
    statistics.missionsStatistics[progressionType].missionsCompletedPerDifficulty,
  ).filter(
    ([difficulty]) =>
      difficulty !== Difficulties.Legendary ||
      statistics.hasProgressionDifficulty(Difficulties.Legendary, progressionType),
  );
  const data: ChartData = {
    labels: entries.map(([difficulty]) => t(`difficulties.${difficulty}`)),
    datasets: [
      {
        data: entries.map(([, count]) => count),
        backgroundColor: entries.map(
          ([difficulty]) => DifficultyColors[difficulty as Difficulties],
        ),
      },
    ],
  };

  const options: ChartOptions = {
    plugins: {
      datalabels: {
        anchor: 'center',
        align: 'center',
        display: (context: Context) =>
          Number(context.dataset.data[context.dataIndex] ?? 0) >
          statistics.missionsStatistics[progressionType].missionsCompleted * 0.05,
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
          label: (c) =>
            tooltipCallbackLabelMissions(
              c,
              statistics.missionsStatistics[progressionType].missionsCompleted,
              t,
            ),
        },
      },
    },
  };

  return (
    <StatisticsChart
      title={t('graphs.missions_completed_per_difficulty')}
      data={data}
      options={options}
      type="doughnut"
      height={360}
    />
  );
}
