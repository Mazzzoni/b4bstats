import { useRecoilValue } from 'recoil';
import SelectedDifficultyState from '@components/riddens/SelectedDifficultyState';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { RiddensProps, RiddenDefinition, RiddenCategories } from '@components/riddens/types';
import RiddensCategory from '@components/riddens/RiddensCategory';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

type Props = RiddensProps

export default function Display(props: Props) {
  const selectedDifficulty = useRecoilValue(SelectedDifficultyState);
  const {t} = useTranslation();

  // Configure defaults options of charts
  Chart.defaults.color = '#fff';
  Chart.defaults.plugins.legend.display = false;
  Chart.defaults.plugins.tooltip.displayColors = false;

  // Register plugins globally
  Chart.register(ChartDataLabels);

  const sortedRiddens: Record<RiddenDefinition['category'], RiddenDefinition[]> = {
    [RiddenCategories.Commons]: [],
    [RiddenCategories.Stingers]: [],
    [RiddenCategories.Reekers]: [],
    [RiddenCategories.Tallboys]: [],
    [RiddenCategories.Cultists]: [],
    [RiddenCategories.Specials]: [],
    [RiddenCategories.Bosses]: [],
  };

  // Order each ridden in their own category
  for (const ridden of props.riddens[selectedDifficulty]) {
    sortedRiddens[ridden.category].push(ridden);
  }

  return (
    <div>
      <h2 className="text-3xl font-bold">{t(`difficulties.${selectedDifficulty}`)}</h2>

      <div className="mt-3 riddens-note">
        <ReactMarkdown>{props.notes[selectedDifficulty]}</ReactMarkdown>
      </div>

      <div className="mt-5 riddens">
        {Object.keys(sortedRiddens).map((category) => (
          <div key={category}>
            <RiddensCategory categoryName={category} riddens={sortedRiddens[category as RiddenDefinition['category']]}/>
          </div>
        ))}
      </div>
    </div>
  );
}