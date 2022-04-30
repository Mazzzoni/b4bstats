import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { RiddenDefinition } from '@components/riddens/RiddenProps';
import { getSuggestedMaxFromArrayOfIntegers, nFormatter } from '@utils/generic';
import { useRecoilValue } from 'recoil';
import SelectedDifficultyState from '@components/riddens/SelectedDifficultyState';
import { Difficulties } from '@components/statistics/types';

type Props = {
  health: RiddenDefinition['health']
}

export default function RiddenHealth({health}: Props) {
  const selectedDifficulty = useRecoilValue(SelectedDifficultyState);

  if (typeof health === 'number') {
    return (
      <div>
        {health}
      </div>
    );
  }

  // Apply weapons damage bonus for certain difficulty to get effective health
  const healthData = Object.values(health).map((h) => {
    if (selectedDifficulty === Difficulties.Recruit) {
      return h * 0.5;
    }

    if (selectedDifficulty === Difficulties.Veteran) {
      return h * 0.8;
    }

    return h;
  });

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