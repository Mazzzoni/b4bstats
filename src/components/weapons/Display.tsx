import { CategoryScale, Chart, Legend, LinearScale, LineElement, PointElement, Tooltip, LineController, BarElement, BarController } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { WeaponCategories, WeaponDefinition, WeaponsProps } from '@components/weapons/types';
import ReactMarkdown from 'react-markdown';
import WeaponsCategory from '@components/weapons/WeaponsCategory';
import { ChartPluginCrosshair } from '@utils/chart-plugin-crosshair';
import Graphs from '@components/weapons/Graphs';
import { ChevronsUp } from 'react-feather';

// Register plugins globally
Chart.register(
  ChartDataLabels,
  CategoryScale,
  Legend,
  Tooltip,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  ChartPluginCrosshair,
  BarElement,
  BarController,
);

// Configure defaults options of charts
Chart.defaults.color = '#fff';
Chart.defaults.borderColor = 'rgba(255,255,255,0.069)';
Chart.defaults.plugins.legend.display = false;
Chart.defaults.plugins.tooltip.displayColors = false;

type Props = WeaponsProps;

export default function Display(props: Props) {
  const sortedWeapons: Record<WeaponDefinition['category'], WeaponDefinition[]> = {
    [WeaponCategories.AssaultRifle]: [],
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

          <div className="mt-10 text-sm">
            <ChevronsUp size={18} className="color-primary inline"/> = Statistic is influenced by weapon quality.
          </div>
        </div>

        <div className="mt-5 weapons">
          {Object.keys(sortedWeapons).map((category) => (
            <div key={category}>
              <WeaponsCategory categoryName={category} weapons={sortedWeapons[category as WeaponDefinition['category']]}/>
            </div>
          ))}

          <Graphs sortedWeapons={sortedWeapons}/>
        </div>
      </div>
    </div>
  );
}