import { Checkbox, Radio, RadioGroup } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import DifficultyFiltersState from '@components/self/DifficultyFiltersState';
import { useRecoilState } from 'recoil';
import { Cleaners, ProgressionTypes } from '@components/statistics/types';
import { getCleanerNameById } from '@utils/generic';
import { Award, List, PieChart } from 'react-feather';
import SelectedProgressionTypeState from '@components/self/SelectedProgressionTypeState';

export default function SelfQuicklinks() {
  const {t} = useTranslation();
  const [difficultyFilters, setDifficultyFilters] = useRecoilState(DifficultyFiltersState);
  const [selectedProgressionType, setSelectedProgressionType] = useRecoilState(SelectedProgressionTypeState);

  return (
    <div className="border-left-subtle pl-3">
      <div className="border-bottom-subtle pb-3">
        <strong>Progressions</strong>

        <RadioGroup
          variant="vertical"
          defaultValue={selectedProgressionType}
          defaultChecked={true}
          className="select-none"
          onChange={(e) => setSelectedProgressionType(e as ProgressionTypes)}>
          <Radio value={ProgressionTypes.Merged}>Both</Radio>
          <Radio value={ProgressionTypes.Online}>Online</Radio>
          <Radio value={ProgressionTypes.Offline}>Offline</Radio>
        </RadioGroup>
      </div>

      <div className="space-y-2 border-bottom-subtle pt-2 pb-3 difficulty-filters">
        <strong>Difficulties</strong>

        <Checkbox
          className="select-none cursor-pointer hover:bg-white/10"
          label={t('difficulties.easy')}
          defaultChecked={difficultyFilters.showRecruit}
          onChange={(e) => {
            setDifficultyFilters({...difficultyFilters, ...{showRecruit: e.target.checked}});
          }}
        />

        <Checkbox
          className="select-none cursor-pointer hover:bg-white/10"
          label={t('difficulties.normal')}
          defaultChecked={difficultyFilters.showVeteran}
          onChange={(e) => {
            setDifficultyFilters({...difficultyFilters, ...{showVeteran: e.target.checked}});
          }}
        />

        <Checkbox
          className="select-none cursor-pointer hover:bg-white/10"
          label={t('difficulties.hard')}
          defaultChecked={difficultyFilters.showNightmare}
          onChange={(e) => {
            setDifficultyFilters({...difficultyFilters, ...{showNightmare: e.target.checked}});
          }}
        />

        <Checkbox
          className="select-none cursor-pointer hover:bg-white/10"
          label={t('difficulties.veryhard')}
          defaultChecked={difficultyFilters.showNoHope}
          onChange={(e) => {
            setDifficultyFilters({...difficultyFilters, ...{showNoHope: e.target.checked}});
          }}
        />

        <Checkbox
          className="select-none cursor-pointer hover:bg-white/10"
          label={t('difficulties.pvp')}
          defaultChecked={difficultyFilters.showSwarm}
          onChange={(e) => {
            setDifficultyFilters({...difficultyFilters, ...{showSwarm: e.target.checked}});
          }}
        />
      </div>

      <div className="space-y-2 pt-1 pb-2 border-bottom-subtle">
        {Object.values(Cleaners).map((cleanerId, i) => (
          <a
            key={cleanerId}
            className={`flex items-center cursor-pointer hover:bg-white/10`}
            data-to-scrollspy-id={getCleanerNameById(cleanerId).toLowerCase()}
            href={`#${getCleanerNameById(cleanerId).toLowerCase()}`}
          >
            <img
              className="w-11 inline"
              src={`/images/cleaners/${getCleanerNameById(cleanerId).toLowerCase()}.webp`}
              alt={getCleanerNameById(cleanerId).toLowerCase()}
            />

            {t(`cleaners.${cleanerId}`)}
          </a>
        ))}
      </div>

      <div className="space-y-2 pt-2">
        <a href="#miscellaneous" className="block hover:bg-white/10 flex items-center px-3">
          <List size={16} className="mr-4 relative top-[-2px]"/> {t('miscellaneous.title')}
        </a>

        <a href="#graphs" className="block hover:bg-white/10 flex items-center px-3">
          <PieChart size={16} className="mr-4 relative top-[-2px]"/> {t('graphs.title')}
        </a>

        <a href="#achievements" className="block hover:bg-white/10 flex items-center px-3">
          <Award size={16} className="mr-4 relative top-[-2px]"/> {t('achievements.title')}
        </a>
      </div>
    </div>
  );
}