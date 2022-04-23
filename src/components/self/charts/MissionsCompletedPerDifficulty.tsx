import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { useRecoilValue } from 'recoil';
import { nFormatter } from '@utils/generic';
import { useTranslation } from 'react-i18next';
import { ChartData, ChartOptions, ChartType, TooltipItem } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';
import StatisticsState from '@components/self/StatisticsState';
import { tooltipCallbackLabelMissions } from '@utils/charts';
import { DifficultyColors } from '@utils/colors';
import SelectedProgressionTypeState from '@components/self/SelectedProgressionTypeState';

export default function MissionsCompletedPerDifficulty() {
  const statistics = useRecoilValue(StatisticsState);
  const progressionType = useRecoilValue(SelectedProgressionTypeState);
  const {t} = useTranslation();

  const data: ChartData = {
    labels: Object.keys(statistics.missionsStatistics[progressionType].missionsCompletedPerDifficulty).map((difficulty) => t(`difficulties.${difficulty}`)),
    datasets: [{
      data: Object.values(statistics.missionsStatistics[progressionType].missionsCompletedPerDifficulty),
      backgroundColor: Object.values(DifficultyColors),
    }],
  };

  const options: ChartOptions = {
    plugins: {
      datalabels: {
        anchor: 'center',
        align: 'center',
        display: (context: Context) => context.dataset.data[context.dataIndex]! > (statistics.missionsStatistics[progressionType].missionsCompleted * 0.05),
        formatter: (value: number) => nFormatter(value, 1),
      },
      legend: {
        display: true,
        align: 'start',
        labels: {
          boxWidth: 16,
        }
      },
      tooltip: {
        callbacks: {
          title: (context: TooltipItem<ChartType>[]) => context[0].label,
          label: (c) => tooltipCallbackLabelMissions(c, statistics.missionsStatistics[progressionType].missionsCompleted, t)
        }
      },
    },
  };

  return (
    <div>
      <strong>{t('graphs.missions_completed_per_difficulty')}</strong>
      <Chart data={data} options={options} type="doughnut"/>
    </div>
  );
}