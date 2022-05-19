import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { RiddenDefinition } from '@components/riddens/types';
import { getSuggestedMaxFromArrayOfIntegers, nFormatter } from '@utils/generic';
import { useRecoilValue } from 'recoil';
import SelectedDifficultyState from '@components/riddens/SelectedDifficultyState';
import { Difficulties } from '@components/statistics/types';

type Props = {
  health: RiddenDefinition['health']
}

// Apply weapons damage bonus for certain difficulty to get effective health
const convertToEffectiveHealth = (health: number, difficulty: Difficulties): number => {
  switch (difficulty) {
    case Difficulties.Recruit:
      return health / 1.5;

    case Difficulties.Veteran:
      return health / 1.2;

    default:
      return health;
  }
};

export default function RiddenHealth({health}: Props) {
  const selectedDifficulty = useRecoilValue(SelectedDifficultyState);

  if (typeof health === 'number') {
    return (
      <div>
        {convertToEffectiveHealth(health, selectedDifficulty).toFixed(2)}
      </div>
    );
  }

  const healthData = Object.values(health).map((h) => convertToEffectiveHealth(h, selectedDifficulty));

  const data: ChartData = {
    labels: Object.keys(health),
    datasets: [{
      data: healthData,
      backgroundColor: '#bb0000',
    }],
  };

  const options: ChartOptions = {
    scales: {
      y: {
        suggestedMax: getSuggestedMaxFromArrayOfIntegers(Object.values(healthData)),
      },
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value: number) => nFormatter(value, 2),
      },
    },
  };

  return (
    <div style={{maxWidth: 450}}>
      <Chart data={data} options={options} type="bar"/>
    </div>
  );
}