import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { RiddenDefinition } from '@components/riddens/RiddenProps';
import { getSuggestedMaxFromArrayOfIntegers, nFormatter } from '@utils/generic';

type Props = {
  health: RiddenDefinition['health']
}

export default function RiddenHealth({health}: Props) {
  if (typeof health === 'number') {
    return (
      <div>
        {health}
      </div>
    );
  }

  const data: ChartData = {
    labels: Object.keys(health),
    datasets: [{
      data: Object.values(health),
      backgroundColor: '#bb0000'
    }],
  };

  const options: ChartOptions = {
    scales: {
      y: {
        suggestedMax: getSuggestedMaxFromArrayOfIntegers(Object.values(health)),
      },
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value: number) => nFormatter(value, 1),
      },
    },
  };

  return (
    <div style={{maxWidth: 450}}>
      <Chart data={data} options={options} type="bar"/>
    </div>
  );
}