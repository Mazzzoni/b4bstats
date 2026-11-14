import type { Dispatch, SetStateAction } from 'react';
import { Button } from '@mantine/core';
import { ChevronDown, ChevronUp } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useUI } from '@translations/useUI';
import type Statistics from '@components/statistics/Statistics';
import { ProgressionTypes, Difficulties } from '@components/statistics/types';
import { LoadingState, ErrorState } from '../Common';
import OnlineStats from './OnlineStats';
import type { ProfileStatsRequest } from './types';

interface Props {
  stats: ProfileStatsRequest;
  statistics: Statistics | null;
  showProgression: boolean;
  setShowProgression: Dispatch<SetStateAction<boolean>>;
}
export default function ProfileProgression({
  stats,
  statistics,
  showProgression,
  setShowProgression,
}: Props) {
  const tr = useUI();
  const { t } = useTranslation();
  const progression = statistics?.progressions[ProgressionTypes.Merged];
  const missionKeys = statistics?.missionsStatistics[ProgressionTypes.Merged].missionsCompletedRaw;
  const hasMissionBreakdown = Object.keys(missionKeys ?? {}).length > 0;
  const progressSummary = [Difficulties.Nightmare, Difficulties.NoHope, Difficulties.Legendary]
    .filter(
      (difficulty) =>
        difficulty !== Difficulties.Legendary ||
        statistics?.hasProgressionDifficulty(difficulty, ProgressionTypes.Merged),
    )
    .map((difficulty) => {
      let completed = 0,
        total = 0;
      for (const cleaner of Object.values(progression ?? {})) {
        for (const done of Object.values(cleaner[difficulty] ?? {})) {
          total++;
          if (done) completed++;
        }
      }
      return { difficulty, completed, total };
    });
  return (
    <section id="profile-progression" className="players-panel players-progression-panel">
      <div className="players-section-heading">
        <h2>{tr('Detailed progression')}</h2>
        <Button
          variant="light"
          size="sm"
          rightSection={showProgression ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          onClick={() => setShowProgression((value) => !value)}
        >
          {tr(showProgression ? 'Hide progression' : 'Show progression')}
        </Button>
      </div>
      {stats.loading ? (
        <p className="px-5 pb-4 text-xs text-muted">Loading progression…</p>
      ) : stats.error ? (
        <ErrorState message={stats.error} retry={stats.retry} />
      ) : hasMissionBreakdown ? (
        <dl
          className="players-section-summary"
          style={{ gridTemplateColumns: `repeat(${progressSummary.length},minmax(0,1fr))` }}
          aria-label="Progression summary"
        >
          {progressSummary.map((item) => (
            <div key={item.difficulty}>
              <dt>
                {t('difficulties.' + item.difficulty, {
                  defaultValue: item.difficulty === 'legendary' ? 'Legendary' : item.difficulty,
                })}
              </dt>
              <dd>
                {item.completed.toLocaleString()}{' '}
                <span className="text-sm font-normal text-muted">
                  / {item.total.toLocaleString()}
                </span>
              </dd>
              <progress
                className="mt-2 h-1 w-full accent-brand"
                value={item.completed}
                max={item.total || 1}
                aria-label={t('difficulties.' + item.difficulty, {
                  defaultValue: item.difficulty,
                })}
              />
            </div>
          ))}
        </dl>
      ) : (
        <p className="px-5 pb-4 text-xs text-muted">No mission breakdown available.</p>
      )}
      {showProgression && (
        <div className="border-t border-line p-4 sm:p-6">
          {stats.loading ? (
            <LoadingState />
          ) : stats.error ? (
            <ErrorState message={stats.error} retry={stats.retry} />
          ) : (
            statistics && <OnlineStats stats={statistics} view="progression" />
          )}
        </div>
      )}
    </section>
  );
}
