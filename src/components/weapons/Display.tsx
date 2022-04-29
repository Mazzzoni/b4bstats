import { CategoryScale, Chart, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { WeaponCategories, WeaponDefinition, WeaponsProps } from '@components/weapons/types';
import ReactMarkdown from 'react-markdown';
import WeaponsCategory from '@components/weapons/WeaponsCategory';
import { ChartPluginCrosshair } from '@utils/chart-plugin-crosshair';

// Register plugins globally
Chart.register(ChartDataLabels, CategoryScale, Legend, Tooltip, LinearScale, PointElement, LineElement, ChartPluginCrosshair);

// Configure defaults options of charts
Chart.defaults.color = '#fff';
Chart.defaults.plugins.legend.display = false;
Chart.defaults.plugins.tooltip.displayColors = false;

type Props = WeaponsProps

export default function Display(props: Props) {
  const sortedWeapons: Record<WeaponDefinition['category'], WeaponDefinition[]> = {
    [WeaponCategories.AssaultRifles]: [],
    [WeaponCategories.Handgun]: [],
    [WeaponCategories.Shotgun]: [],
    [WeaponCategories.SMG]: [],
    [WeaponCategories.LMG]: [],
    [WeaponCategories.Sniper]: [],
    [WeaponCategories.Melee]: [],
  };

  // Order each ridden in their own category
  for (const weapon of props.weapons) {
    sortedWeapons[weapon.category].push(weapon);
  }

  return (
    <div>
      <div>
        <h2 className="text-3xl font-bold">Weapons</h2>

        <div className="mt-3 weapons-note">
          <ReactMarkdown>{props.note}</ReactMarkdown>
        </div>

        <div className="mt-5 weapons">
          {Object.keys(sortedWeapons).map((category) => (
            <div key={category}>
              <WeaponsCategory categoryName={category} weapons={sortedWeapons[category as WeaponDefinition['category']]}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}