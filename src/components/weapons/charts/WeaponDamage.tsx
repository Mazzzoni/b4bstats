import * as ReactDOM from 'react-dom';
import { WeaponCategories, WeaponDefinition, WeaponQualities } from '@components/weapons/types';
import { Chart } from 'react-chartjs-2';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { WeaponQualityColors } from '@utils/colors';
import { Badge, Tooltip } from '@mantine/core';
import { CrosshairOptions } from '@utils/chart-plugin-crosshair';
import { getSuggestedMaxFromArrayOfIntegers } from '@utils/generic';
import { useRecoilValue } from 'recoil';
import SelectedQualityState from '@components/weapons/SelectedQualityState';
import ChartTooltip, { TooltipProps } from '@components/weapons/charts/ChartTooltip';
import { getDamageStatistics, getWeaponQuality } from '@components/weapons/utils';

// Show only few ticks on the overall meters axis
const shownTicks = [250, 500, 1000, 1500, 2000, 3000, 4000];

const getSpsFormula = (weapon: WeaponDefinition): string => {
  switch (weapon.category) {
    case WeaponCategories.Melee:
      return '(Stumble Per Shot * RPM) / 60';
  }

  return 'Stumble Per Shot * (1 / Delay Between Shots + Rechamber Time)';
};

type Props = {
  weapon: WeaponDefinition
}

export default function WeaponDamage({weapon}: Props) {
  const selectedQuality = useRecoilValue(SelectedQualityState);

  const datasets: ChartDataset[] = Object.keys(weapon.qualities).map((quality) => {
    const data = weapon.qualities[quality as WeaponQualities].rangeDamagesComputed;

    return {
      label: quality,
      data: data,
      borderColor: WeaponQualityColors[quality as WeaponQualities],
      borderWidth: selectedQuality === quality ? 4 : 2,
      pointHoverRadius: selectedQuality === quality ? 6 : 4,
    };
  }).reverse();

  const weaponQuality = getWeaponQuality(weapon, selectedQuality);
  const damageStatistics = getDamageStatistics(weaponQuality);

  const qualityColor = Object.keys(weapon.qualities).includes(selectedQuality)
    ? WeaponQualityColors[selectedQuality]
    : datasets[0].borderColor;

  const baseDamage = weaponQuality.rangeDamagesComputed[0];

  const data: ChartData = {
    labels: weaponQuality.metersScale,
    datasets: datasets,
  };

  // Extend options
  const options: ChartOptions & { plugins: { crosshair: CrosshairOptions } } = {
    // Disable animation, save a bit of performance
    animation: false,
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: getSuggestedMaxFromArrayOfIntegers(datasets.map((d => Math.max(...(d.data as number[])))), 0.3),
      },
      xAxis: {
        ticks: {
          callback: (label, index, ticks) => {
            const range = weaponQuality.metersScale[index];

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
            tooltipEl.style.zIndex = '15';
            document.getElementsByClassName('weapons')[0].appendChild(tooltipEl);
          }

          if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = '0';

            return;
          }

          const dataIndex = tooltip.dataPoints[0].dataIndex;
          const meter = weaponQuality.metersScale[dataIndex];
          const datasets = chart.data.datasets;
          let damages: TooltipProps['damages'] = [];

          for (const dataset of datasets) {
            const quality = dataset.label as WeaponQualities;
            const damage = dataset.data[dataIndex] as number;
            damages.push({
              quality,
              damage,
              ...getDamageStatistics(weapon.qualities[quality], damage),
            });
          }

          ReactDOM.render(
            <ChartTooltip
              meter={meter}
              damages={damages}
              isMelee={weapon.category === WeaponCategories.Melee}
              isBow={weapon.category === WeaponCategories.Bow}
            />,
            tooltipEl,
          );

          const position = chart.canvas.getBoundingClientRect();

          tooltipEl.style.opacity = '1';
          tooltipEl.style.left = position.left + window.scrollX + tooltip.caretX - tooltipEl.offsetWidth - 20 + 'px';
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
      <div className="mb-3 flex flex-wrap gap-2">
        <Tooltip
          label={<div>
            <b>Base damage</b>
            <br/>
            <span>Base damage done per shot</span>
          </div>}
        >
          <Badge color="dark" size="lg" style={{borderColor: qualityColor as string}}>{baseDamage.toFixed(2)} DMG</Badge>
        </Tooltip>

        {weapon.category !== WeaponCategories.Bow && (
          <Tooltip
            label={<div>
              <b>Raw DPS</b>
              <br/>
              <span>Damage per second while firing, without reloads</span>
              <br/>
              <span className="bg-stone-400 px-1">Base Damage * RPM / 60</span>
            </div>}
          >
            <Badge color="dark" size="lg" style={{borderColor: qualityColor as string}}>{damageStatistics.rawDps.toFixed(2)} Raw DPS</Badge>
          </Tooltip>
        )}

        {weapon.category !== WeaponCategories.Melee && weapon.category !== WeaponCategories.Bow && (
          <Tooltip
            label={<div>
              <b>Sustained DPS</b>
              <br/>
              <span>Average damage per second over full magazines, including reloads</span>
              <br/>
              <span className="bg-stone-400 px-1">Shots per Magazine * Base Damage / (Shots per Magazine * 60 / RPM + Reload Time)</span>
              <br/>
              <span>Shots per Magazine = Magazine Size / {weaponQuality.roundsPerShot || 1} round(s) per shot</span>
            </div>}
          >
            <Badge color="dark" size="lg" style={{borderColor: qualityColor as string}}>{damageStatistics.sustainedDps.toFixed(2)} Sustained DPS</Badge>
          </Tooltip>
        )}

        {weapon.category !== WeaponCategories.Melee && weapon.category !== WeaponCategories.Bow && (
          <Tooltip
            label={<div>
              <b>Full Magazine Damage</b>
              <br/>
              <span>Overall damage done for a full magazine fired</span>
              <br/>
              <span className="bg-stone-400 px-1">Magazine Size / {weaponQuality.roundsPerShot || 1} round(s) per shot * Base Damage</span>
            </div>}
          >
            <Badge color="dark" size="lg" style={{borderColor: qualityColor as string}}>{damageStatistics.fullMagazineDamage.toFixed(2)} FMD</Badge>
          </Tooltip>
        )}
      </div>

      <div className="relative">
        <Chart data={data} options={options} type="line"/>

        {weapon.category !== WeaponCategories.Bow && (
          <div className="absolute z-10 bottom-16 left-16 space-x-2">
            <Tooltip
              label={<div>
                <b>Stumble Per Shot</b>
                <br/>
                <span>Stumble applied per shot</span>
                <br/>
                <span className="bg-stone-400 px-1">Base Damage * Stumble Ratio</span>
              </div>}
            >
              <Badge color="dark" size="lg" style={{borderColor: qualityColor as string}}>{weaponQuality.stumblePerShot.toFixed(2)} Stumble</Badge>
            </Tooltip>

            <Tooltip
              label={<div>
                <b>Stumble Per Second</b>
                <br/>
                <span>Stumble applied per second</span>
                <br/>
                <span className="bg-stone-400 px-1">{getSpsFormula(weapon)}</span>
              </div>}
            >
              <Badge color="dark" size="lg" style={{borderColor: qualityColor as string}}>{weaponQuality.stumblePerSecond.toFixed(2)} SPS</Badge>
            </Tooltip>
          </div>
        )}

        {weaponQuality.pellets > 1 && (
          <div className="absolute z-10 top-12 right-16">
            <Tooltip label="Pellets per shot">
              <Badge color="dark" size="sm">{weaponQuality.pellets} pellets</Badge>
            </Tooltip>
          </div>
        )}

        {weapon.category === WeaponCategories.Shotgun && (
          <div className="absolute z-10 top-20 right-16">
            <Tooltip label="First pellet bonus damage">
              <Badge color="dark" size="sm">
                {weaponQuality.rangeDamages[Object.keys(weaponQuality.rangeDamages)[0]].toFixed(2)} DMG
              </Badge>
            </Tooltip>
          </div>
        )}

        {weaponQuality.stamina && (
          <div className="absolute z-10 top-12 right-16">
            <Tooltip label="Stamina consumed per hit">
              <Badge color="dark" size="sm">{weaponQuality.stamina} stamina</Badge>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}
