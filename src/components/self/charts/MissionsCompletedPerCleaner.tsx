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
import SelectedProgressionTypeState from '@components/self/SelectedProgressionTypeState';

export default function MissionsCompletedPerCleaner() {
  const statistics = useRecoilValue(StatisticsState);
  const progressionType = useRecoilValue(SelectedProgressionTypeState);
  const {t} = useTranslation();

  let missionsRecruitCompleted: number[] = [];
  let missionsVeteranCompleted: number[] = [];
  let missionsNightmareCompleted: number[] = [];
  let missionsNoHopeCompleted: number[] = [];
  let missionsSwarmCompleted: number[] = [];
  let missionsTotalCompleted: number[] = [];

  Object.values(statistics.missionsStatistics[progressionType].missionsCompletedPerCleaner).map((cleaner) => {
    missionsRecruitCompleted.push(cleaner.easy);
    missionsVeteranCompleted.push(cleaner.normal);
    missionsNightmareCompleted.push(cleaner.hard);
    missionsNoHopeCompleted.push(cleaner.veryhard);
    missionsSwarmCompleted.push(cleaner.pvp);
    missionsTotalCompleted.push(cleaner.total);
  });

  const datasets = [
    {
      label: t(`difficulties.easy`),
      data: missionsRecruitCompleted,
      backgroundColor: DifficultyColors[Difficulties.Recruit],
    },
    {
      label: t(`difficulties.normal`),
      data: missionsVeteranCompleted,
      backgroundColor: DifficultyColors[Difficulties.Veteran],
    },
    {
      label: t(`difficulties.hard`),
      data: missionsNightmareCompleted,
      backgroundColor: DifficultyColors[Difficulties.Nightmare],
    },
    {
      label: t(`difficulties.veryhard`),
      data: missionsNoHopeCompleted,
      backgroundColor: DifficultyColors[Difficulties.NoHope],
    },
    {
      label: t(`difficulties.pvp`),
      data: missionsSwarmCompleted,
      backgroundColor: DifficultyColors[Difficulties.Swarm],
    },
  ];

  const data: ChartData = {
    labels: Object.values(Cleaners).map(cleaner => t(`cleaners.${cleaner}`)),
    datasets: datasets,
  };

  const options: ChartOptions = {
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: {
            weight: '700',
          },
          callback: function (value, index, values) {
            const cleanerId = Object.values(Cleaners)[index];
            const missionsCompletedByCleaner = missionsTotalCompleted[index];

            return `${t(`cleaners.${cleanerId}`)} - ${missionsCompletedByCleaner}`;
          },
        },
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
          let overallMissionsCompleted = statistics.missionsStatistics[progressionType].missionsCompleted;

          // @ts-ignore We know this key exists, ignore the error
          for (const legendItem of context.chart.legend.legendItems) {
            if (legendItem.hidden) {
              switch (legendItem.datasetIndex) {
                case 0: // easy
                  overallMissionsCompleted -= statistics.missionsStatistics[progressionType].missionsCompletedPerDifficulty.easy;
                  break;
                case 1: // normal
                  overallMissionsCompleted -= statistics.missionsStatistics[progressionType].missionsCompletedPerDifficulty.normal;
                  break;
                case 2: // hard
                  overallMissionsCompleted -= statistics.missionsStatistics[progressionType].missionsCompletedPerDifficulty.hard;
                  break;
                case 3: // veryhard
                  overallMissionsCompleted -= statistics.missionsStatistics[progressionType].missionsCompletedPerDifficulty.veryhard;
                  break;
                case 4: // pvp
                  overallMissionsCompleted -= statistics.missionsStatistics[progressionType].missionsCompletedPerDifficulty.pvp;
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
          title: (tooltipItems) => {
            const tooltip = tooltipItems[0];

            return `${tooltip.label} - ${tooltip.dataset.label}`;
          },
          label: (c) => tooltipCallbackLabelMissions(c, statistics.missionsStatistics[progressionType].missionsCompleted, t),
        },
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
            values={{count: localeFormat(statistics.missionsStatistics[progressionType].missionsCompleted)}}
            components={{b: <b/>}}
          />
        </Badge>
      </div>
    </div>
  );
}