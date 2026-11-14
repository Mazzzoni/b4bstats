import { useAtomValue } from 'jotai';
import StatisticsState from '@components/self/StatisticsState';
import { useTranslation } from 'react-i18next';
import { useUI } from '@translations/useUI';
import DifficultyFiltersState, {
  type DifficultyFilters,
} from '@components/self/DifficultyFiltersState';
import { currentCleanerOrder, getCleanerIdsByNames, getCleanerNameById } from '@utils/generic';
import { Cleaners, Difficulties } from '@components/statistics/types';
import { useMantineTheme } from '@mantine/core';

import SelectedProgressionTypeState from '@components/self/SelectedProgressionTypeState';
import ProgressionsDifficultySection from '@components/self/ProgressionsDifficultySection';

export default function Progressions({
  difficultyFilters,
}: {
  difficultyFilters?: Partial<DifficultyFilters>;
}) {
  const savedFilters = useAtomValue(DifficultyFiltersState);
  const filters = { ...savedFilters, ...difficultyFilters };
  const statistics = useAtomValue(StatisticsState);
  const progressionType = useAtomValue(SelectedProgressionTypeState);
  const progressions = statistics.progressions[progressionType];
  const theme = useMantineTheme();
  const { t } = useTranslation();
  const tr = useUI();
  const missionsPerCleaner =
    statistics.missionsStatistics[progressionType].missionsCompletedPerCleaner;

  const progressionsOrderByCurrentCleanerNames = getCleanerIdsByNames(currentCleanerOrder);

  if (
    !filters.showRecruit &&
    !filters.showVeteran &&
    !filters.showNightmare &&
    !filters.showNoHope &&
    !filters.showLegendary &&
    !filters.showSwarm
  ) {
    return null;
  }

  return (
    <div style={{ backgroundColor: theme.colors.dark[7] }}>
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold">
          {t('progressions.title', { defaultValue: 'Progressions' })}
        </h2>
      </div>

      <div>
        {progressionsOrderByCurrentCleanerNames.map((cleanerId, i) => (
          <div
            key={cleanerId}
            id={getCleanerNameById(cleanerId).toLowerCase()}
            className="grid gap-5 grid-cols-1 sm:grid-cols-12"
          >
            <div className="text-center sm:col-span-2">
              <div className="sticky top-[80px] flex flex-col items-center">
                <img
                  className="inline w-24 sm:w-48"
                  src={`/images/cleaners/${getCleanerNameById(cleanerId).toLowerCase()}.webp`}
                  alt={getCleanerNameById(cleanerId)}
                />

                <strong className="mt-3">{t(`cleaners.${cleanerId}`)}</strong>
                <dl className="cleaner-missions-total mt-3 text-center">
                  <dt className="text-xs text-muted">{tr('Missions done')}</dt>
                  <dd className="mt-1 text-xl font-semibold tabular-nums">
                    {missionsPerCleaner[cleanerId].total.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>

            <div className="min-w-0 sm:col-span-10">
              {Object.values(Difficulties)
                .filter(
                  (difficulty) =>
                    difficulty !== Difficulties.Legendary ||
                    statistics.hasProgressionDifficulty(Difficulties.Legendary, progressionType),
                )
                .map((difficulty, i) => (
                  <ProgressionsDifficultySection
                    key={difficulty}
                    filters={filters}
                    progressions={progressions}
                    cleaner={cleanerId as Cleaners}
                    difficulty={difficulty as Difficulties}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
