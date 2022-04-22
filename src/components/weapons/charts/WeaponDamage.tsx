import * as ReactDOM from 'react-dom';
import { WeaponDefinition, WeaponRarities } from '@components/weapons/types';
import { Chart } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { getDamageData, getMetersScale } from '@components/weapons/utils';
import { WeaponRarityColors } from '@utils/colors';
import { Badge } from '@mantine/core';

// Show only few ticks on the overall meters axis
const shownTicks = [250, 500, 1000, 1500, 2000, 3000, 4000];

type TooltipProps = {
  meter: number
  damages: {
    quality: string
    damage: number
  }[]
}

function Tooltip({meter, damages}: TooltipProps)
{
  return (
    <div className="primary-bg-color">
      <div className="font-bold text px-2 py-1">Distance: {meter / 100}m</div>
      <div className="px-2 py-1">
        <table>
          <thead>
          <tr>
            <th>Quality</th>
            <th>Damage</th>
          </tr>
          </thead>

          <tbody className="text-left">
          {damages.map((row) => (
            <tr key={row.damage}>
              <td>{row.quality}</td>
              <td>{row.damage.toFixed(2)}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type Props = {
  weapon: WeaponDefinition
}

export default function WeaponDamage({weapon}: Props) {
  const metersScale = getMetersScale();
  const damages = getDamageData(weapon, metersScale);
  // console.log(damages);

  const data: ChartData = {
    labels: metersScale,
    datasets: [
      // TODO: Loop over each weapon quality and display its damages over scale
      {
        label: 'Common',
        data: damages,
        borderColor: WeaponRarityColors[WeaponRarities.Common],
      },
    ],
  };

  const options: ChartOptions = {
    scales: {
      xAxis: {
        ticks: {
          callback: (label, index, ticks) => {
            const range = metersScale[index];

            if (shownTicks.includes(range)) {
              const meter = range / 100;

              return `${meter}m`;
            }
          },
        },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    hover: {
      mode: 'x',
      intersect: false,
    },
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    plugins: {
      datalabels: {
        display: false,
      },
      tooltip: {
        mode: 'x',
        enabled: false,
        // Create a custom HTML tooltip to be displayed
        external: ({chart, tooltip}) => {
          let tooltipEl = document.getElementById('chartjs-custom-tooltip');

          if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-custom-tooltip';
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.pointerEvents = 'none';
            document.body.appendChild(tooltipEl);
            // ReactDOM.findDOMNode(this)?.appendChild(tooltipEl);
            // document.getElementById('__next')!.appendChild(tooltipEl);

            // console.log(document.getEle);
          }

          if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = '0';

            return;
          }

          // console.log(tooltip);
          // console.log(data);

          const dataIndex = tooltip.dataPoints[0].dataIndex;
          const meter = metersScale[dataIndex];
          const datasets = chart.data.datasets;
          let damages: TooltipProps['damages'] = [];

          for (const dataset of datasets) {
            damages.push({
              quality: dataset.label as string,
              damage: dataset.data[dataIndex] as number,
            });
          }

          ReactDOM.render(<Tooltip meter={meter} damages={damages}/>, tooltipEl);

          const position = chart.canvas.getBoundingClientRect();

          tooltipEl.style.opacity = '1';
          tooltipEl.style.left = position.left + window.scrollX + tooltip.caretX + 10 + 'px';
          tooltipEl.style.top = position.top + window.scrollY + tooltip.caretY + 'px';
        },

        // callbacks: {
        //   title: (tooltipItems) => {
        //     return `${tooltipItems[0].label}m`;
        //   },
        //   label: (tooltipItem) => {
        //     // console.log(tooltipItem);
        //     const dataIndex = tooltipItem.dataIndex;
        //     const datasets = tooltipItem.chart.data.datasets;
        //     let body = '';
        //
        //     for (const dataset of datasets) {
        //       body += `${dataset.label}: ${dataset.data[dataIndex]}\n`;
        //     }
        //
        //     return body;
        //   },
        // },
      },
    },
  };

  return (
    <div className="p-4">
      <Chart data={data} options={options} type="line"/>
    </div>
  );
}