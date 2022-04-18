import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { useRecoilValue } from 'recoil';
import { Trans, useTranslation } from 'react-i18next';
import { ChartData, ChartOptions } from 'chart.js';
import { localeFormat, nFormatter } from '@utils/generic';
import StatisticsState from '@components/self/StatisticsState';
import { DifficultyColors } from '@utils/colors';
import { Cleaners, Difficulties } from '@components/statistics/types';
import { tooltipCallbackLabelMissions } from '@utils/charts';
import { Badge } from '@mantine/core';

export default function MissionsCompletedPerCleaner() {
  const statistics = useRecoilValue(StatisticsState);
  const {t} = useTranslation();

  const missionsEasyCompleted = Object.values(statistics.missionsStatistics.missionsCompletedPerCleaner).map(cleaner => cleaner.easy);
  const missionsNormalCompleted = Object.values(statistics.missionsStatistics.missionsCompletedPerCleaner).map(cleaner => cleaner.normal);
  const missionsHardCompleted = Object.values(statistics.missionsStatistics.missionsCompletedPerCleaner).map(cleaner => cleaner.hard);
  const missionsVeryHardCompleted = Object.values(statistics.missionsStatistics.missionsCompletedPerCleaner).map(cleaner => cleaner.veryhard);
  const missionsPvpCompleted = Object.values(statistics.missionsStatistics.missionsCompletedPerCleaner).map(cleaner => cleaner.pvp);
  const missionsTotalCompleted = Object.values(statistics.missionsStatistics.missionsCompletedPerCleaner).map(cleaner => cleaner.total);

  const datasets = [
    {
      label: t(`difficulties.easy`),
      data: missionsEasyCompleted,
      backgroundColor: DifficultyColors[Difficulties.Recruit],
    },
    {
      label: t(`difficulties.normal`),
      data: missionsNormalCompleted,
      backgroundColor: DifficultyColors[Difficulties.Veteran],
    },
    {
      label: t(`difficulties.hard`),
      data: missionsHardCompleted,
      backgroundColor: DifficultyColors[Difficulties.Nightmare],
    },
    {
      label: t(`difficulties.veryhard`),
      data: missionsVeryHardCompleted,
      backgroundColor: DifficultyColors[Difficulties.NoHope],
    },
    {
      label: t(`difficulties.pvp`),
      data: missionsPvpCompleted,
      backgroundColor: DifficultyColors[Difficulties.Swarm],
    },
  ];

  const data: ChartData<'bar'> = {
    labels: Object.values(Cleaners).map(cleaner => t(`cleaners.${cleaner}`)),
    datasets: datasets,
  };

  const options: ChartOptions<'bar'> = {
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: {
            weight: '700'
          },
          callback: function (value, index, values) {
            const cleanerId = Object.values(Cleaners)[index];
            const missionsCompletedByCleaner = missionsTotalCompleted[index];

            return `${t(`cleaners.${cleanerId}`)} - ${missionsCompletedByCleaner}`;
          },
        }
      },
      y: {
        stacked: true,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        // To determine if we display or not, we recompute on how many total missions completed are being displayed (based on filters hidden / show)
        display: (context) => {
          let overallMissionsCompleted = statistics.missionsStatistics.missionsCompleted;

          // @ts-ignore We know this key exists, ignore the error
          for (const legendItem of context.chart.legend.legendItems) {
            if (legendItem.hidden) {
              switch (legendItem.datasetIndex) {
                case 0: // easy
                  overallMissionsCompleted -= statistics.missionsStatistics.missionsCompletedPerDifficulty.easy;
                  break;
                case 1: // normal
                  overallMissionsCompleted -= statistics.missionsStatistics.missionsCompletedPerDifficulty.normal;
                  break;
                case 2: // hard
                  overallMissionsCompleted -= statistics.missionsStatistics.missionsCompletedPerDifficulty.hard;
                  break;
                case 3: // pvp
                  overallMissionsCompleted -= statistics.missionsStatistics.missionsCompletedPerDifficulty.pvp;
                  break;
              }
            }
          }

          const value = context.dataset.data[context.dataIndex] as number;
          const percent = value / overallMissionsCompleted * 100;

          return percent > 2.5;
        },
        formatter: (value: number) => nFormatter(value, 1),
      },
      tooltip: {
        callbacks: {
          title(tooltipItems): string {
            const tooltip = tooltipItems[0];

            return `${tooltip.label} - ${tooltip.dataset.label}`;
          },
          label: (c) => tooltipCallbackLabelMissions(c, statistics.missionsStatistics.missionsCompleted, t)
        }
      },
    },
  };

  return (
    <div>
      <strong>{t('graphs.missions_completed_per_cleaner')}</strong>
      <Chart data={data} options={options} type="bar"/>
      <div className="mt-3">
        <Badge>
          <Trans
            i18nKey="graphs.labels.total_missions_completed"
            values={{count: localeFormat(statistics.missionsStatistics.missionsCompleted)}}
            components={{b: <b/>}}
          />
        </Badge>
      </div>
    </div>
  );
}