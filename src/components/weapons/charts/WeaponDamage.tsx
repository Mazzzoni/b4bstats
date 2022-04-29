import * as ReactDOM from 'react-dom';
import { WeaponDefinition, WeaponRarities } from '@components/weapons/types';
import { Chart } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { getDamageData, getMetersScale } from '@components/weapons/utils';
import { WeaponRarityColors } from '@utils/colors';
import { Badge } from '@mantine/core';
import { CrosshairOptions } from '@utils/chart-plugin-crosshair';
import { getSuggestedMaxFromArrayOfIntegers } from '@utils/generic';

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
    <div className="primary-bg-color min-w-[200px] border">
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
          {damages.reverse().map((row) => (
            <tr key={row.damage}>
              <td><Badge>{row.quality}</Badge></td>
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
  const datasets = Object.keys(weapon.qualities).map((quality) => {
    return {
      label: quality,
      data: getDamageData(weapon.qualities[quality as WeaponRarities].range_damages, metersScale),
      borderColor: WeaponRarityColors[quality as WeaponRarities],
    };
  });

  const data: ChartData = {
    labels: metersScale,
    datasets: datasets,
  };

  // Extend options
  const options: ChartOptions & { plugins: { crosshair: CrosshairOptions } } = {
    scales: {
      y: {
        suggestedMax: getSuggestedMaxFromArrayOfIntegers(datasets.map((d => Math.max(...d.data)))),
      },
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
      intersect: false,
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      datalabels: {
        display: false,
      },
      tooltip: {
        enabled: false,
        // Create a custom HTML tooltip to be displayed
        external: ({chart, tooltip}) => {
          let tooltipEl = document.getElementById('chartjs-custom-tooltip');

          if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-custom-tooltip';
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.pointerEvents = 'none';
            tooltipEl.style.transition = 'all 300ms';
            tooltipEl.style.transform = 'translateY(-50%)';
            document.getElementsByClassName('weapons')[0].appendChild(tooltipEl);
          }

          if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = '0';

            return;
          }

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
          tooltipEl.style.left = position.left + window.scrollX + tooltip.caretX + 20 + 'px';
          tooltipEl.style.top = position.top + window.scrollY + tooltip.caretY + 'px';
        },
      },
      crosshair: {
        horizontal: false,
        vertical: true,
        color: 'red',
        dash: [5],
        width: 0.5,
      },
    },
  };

  return (
    <div className="p-4 cursor-crosshair relative">
      <Chart data={data} options={options} type="line"/>

      <span className="absolute z-10 top-12 right-16">{weapon.pellets} pellet{weapon.pellets > 1 && 's'}</span>
    </div>
  );
}