import { useRecoilValue } from 'recoil';
import StatisticsState from '@components/self/StatisticsState';
import { useTranslation } from 'react-i18next';
import DifficultyFiltersState from '@components/self/DifficultyFiltersState';
import { getCleanerNameById, getFormattedDate } from '@utils/generic';
import { Cleaners, Difficulties } from '@components/statistics/types';
import { useMantineTheme } from '@mantine/core';
import ScrollSpy from 'react-ui-scrollspy';
import { createRef } from 'react';
import ScreenshotTaker from '@components/common/ScreenshotTaker';
import SelectedProgressionTypeState from '@components/self/SelectedProgressionTypeState';
import ProgressionsDifficultySection from '@components/self/ProgressionsDifficultySection';

export default function Progressions() {
  const elementToScreenshotRef = createRef<HTMLDivElement>();
  const filters = useRecoilValue(DifficultyFiltersState);
  const statistics = useRecoilValue(StatisticsState);
  const progressionType = useRecoilValue(SelectedProgressionTypeState);
  const progressions = statistics.progressions[progressionType];
  const theme = useMantineTheme();
  const {t} = useTranslation();

  if (!filters.showRecruit && !filters.showVeteran && !filters.showNightmare && !filters.showNoHope && !filters.showSwarm) {
    return null;
  }

  return (
    <div ref={elementToScreenshotRef} style={{backgroundColor: theme.colors.dark[8]}}>
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold">Progressions</h2>
        <ScreenshotTaker elementToScreenshotRef={elementToScreenshotRef} filename={`b4bstats_mazz__progressions__${getFormattedDate()}`}/>
      </div>

      <ScrollSpy activeClass="bg-white/5" scrollThrottle={100}>
        {Object.keys(progressions).map((cleanerId, i) => (
          <div key={cleanerId} id={getCleanerNameById(cleanerId).toLowerCase()} className="grid gap-4 grid-cols-12">
            <div className="text-center col-span-2">
              <div className="sticky top-[80px] flex flex-col items-center">
                <img
                  className="w-48 inline"
                  src={`/images/cleaners/${getCleanerNameById(cleanerId).toLowerCase()}.webp`}
                  alt={getCleanerNameById(cleanerId)}
                />

                <strong className="mt-3">{t(`cleaners.${cleanerId}`)}</strong>
              </div>
            </div>

            <div className="col-span-10">
              {Object.keys(progressions[cleanerId]).map((difficulty, i) =>
                <ProgressionsDifficultySection key={i} progressions={progressions} cleaner={cleanerId as Cleaners} difficulty={difficulty as Difficulties}/>,
              )}
            </div>
          </div>
        ))}
      </ScrollSpy>
    </div>
  );
}