import { Checkbox, Radio, RadioGroup, Tooltip } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import DifficultyFiltersState from '@components/self/DifficultyFiltersState';
import { useRecoilState } from 'recoil';
import { Cleaners } from '@components/statistics/types';
import { getCleanerNameById } from '@utils/generic';
import { Award, List, PieChart } from 'react-feather';

export default function SelfQuicklinks() {
  const {t} = useTranslation();
  const [difficultyFilters, setDifficultyFilters] = useRecoilState(DifficultyFiltersState);

  return (
    <div className="border-left-subtle pl-3">
      <div className="border-bottom-subtle pb-3">
        <strong>Progressions</strong>

        <RadioGroup
          variant="vertical"
          defaultValue="online"
          defaultChecked={true}
          className="select-none"
        >
          <Radio value="online">Online</Radio>

          <Radio value="offline" disabled={true}>
            <Tooltip
              withArrow
              position="right"
              label={<span>Only <strong className="underline">online</strong> progression is available from statistics file at the moment.<br/>We can expect offline tracking in future updates.</span>}
            >
              Offline
            </Tooltip>
          </Radio>

          <Radio value="both" disabled={true}>
            <Tooltip
              withArrow
              position="right"
              label={<span>Only <strong className="underline">online</strong> progression is available from statistics file at the moment.<br/>We can expect offline tracking in future updates.</span>}
            >
              Both
            </Tooltip>
          </Radio>
        </RadioGroup>
      </div>

      <div className="space-y-2 border-bottom-subtle pt-2 pb-3 difficulty-filters">
        <strong>Difficulties</strong>

        <Checkbox
          className="select-none cursor-pointer hover:bg-white/10"
          label={t('difficulties.easy')}
          defaultChecked={difficultyFilters.showEasy}
          onChange={(e) => {
            setDifficultyFilters({...difficultyFilters, ...{showEasy: e.target.checked}});
          }}
        />

        <Checkbox
          className="select-none cursor-pointer hover:bg-white/10"
          label={t('difficulties.normal')}
          defaultChecked={difficultyFilters.showNormal}
          onChange={(e) => {
            setDifficultyFilters({...difficultyFilters, ...{showNormal: e.target.checked}});
          }}
        />

        <Checkbox
          className="select-none cursor-pointer hover:bg-white/10"
          label={t('difficulties.hard')}
          defaultChecked={difficultyFilters.showHard}
          onChange={(e) => {
            setDifficultyFilters({...difficultyFilters, ...{showHard: e.target.checked}});
          }}
        />

        <Checkbox
          className="select-none cursor-pointer hover:bg-white/10"
          label={t('difficulties.veryhard')}
          defaultChecked={difficultyFilters.showVeryHard}
          onChange={(e) => {
            setDifficultyFilters({...difficultyFilters, ...{showVeryHard: e.target.checked}});
          }}
        />

        <Checkbox
          className="select-none cursor-pointer hover:bg-white/10"
          label={t('difficulties.pvp')}
          defaultChecked={difficultyFilters.showPvp}
          onChange={(e) => {
            setDifficultyFilters({...difficultyFilters, ...{showPvp: e.target.checked}});
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
          <List size={16} className="mr-4"/> {t('miscellaneous.title')}
        </a>

        <a href="#graphs" className="block hover:bg-white/10 flex items-center px-3">
          <PieChart size={16} className="mr-4"/> {t('graphs.title')}
        </a>

        <a href="#achievements" className="block hover:bg-white/10 flex items-center px-3">
          <Award size={16} className="mr-4"/> {t('achievements.title')}
        </a>
      </div>
    </div>
  );
}