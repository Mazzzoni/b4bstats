import { Radio } from '@mantine/core';
import { Difficulties } from '@components/statistics/types';
import { useAtom } from 'jotai';
import SelectedDifficultyState from '@components/riddens/SelectedDifficultyState';
import { RiddenCategories } from '@components/riddens/types';
import { useTranslation } from 'react-i18next';
export default function RiddensQuicklinks() {
  const [selectedDifficulty, setSelectedDifficulty] = useAtom(SelectedDifficultyState);
  const { t } = useTranslation();
  return (
    <div className="border-left-subtle pl-3">
      <div className="border-bottom-subtle pb-3">
        <strong>Difficulty</strong>

        <Radio.Group
          value={selectedDifficulty}
          className="select-none"
          onChange={(e) => setSelectedDifficulty(e as Difficulties)}
        >
          {Object.values(Difficulties).map((difficulty) => (
            <Radio
              key={difficulty}
              value={difficulty}
              label={
                t(`difficulties.${difficulty}`) +
                (difficulty === Difficulties.Legendary ? ' · Trial of the Worm' : '')
              }
            />
          ))}
        </Radio.Group>
      </div>

      <div className="space-y-2 pt-3">
        <strong>Categories</strong>

        {Object.values(RiddenCategories).map((category) => (
          <a key={category} href={`#${category}`} className="hover:bg-white/10 block capitalize">
            {category}
          </a>
        ))}
      </div>
    </div>
  );
}
