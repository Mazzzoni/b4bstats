import type { Dispatch, SetStateAction } from 'react';
import { Button } from '@mantine/core';
import { ChevronDown, ChevronUp } from 'react-feather';
import { useUI } from '@translations/useUI';
import type Statistics from '@components/statistics/Statistics';
import { LoadingState, ErrorState } from '../Common';
import OnlineStats from './OnlineStats';
import type { ProfileStatsRequest } from './types';

interface Props {
  stats: ProfileStatsRequest;
  statistics: Statistics | null;
  showStats: boolean;
  setShowStats: Dispatch<SetStateAction<boolean>>;
}
export default function ProfileStatistics({ stats, statistics, showStats, setShowStats }: Props) {
  const tr = useUI();
  return (
    <section id="profile-statistics" className="players-panel">
      <div className="players-section-heading">
        <div>
          <h2>{tr('Detailed statistics')}</h2>
        </div>
        <Button
          variant="light"
          size="sm"
          rightSection={showStats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          onClick={() => setShowStats((v) => !v)}
        >
          {tr(showStats ? 'Hide details' : 'Show details')}
        </Button>
      </div>
      {showStats && (
        <div className="border-t border-line p-4 sm:p-6">
          {stats.loading ? (
            <LoadingState />
          ) : stats.error ? (
            <ErrorState message={stats.error} retry={stats.retry} />
          ) : (
            statistics && <OnlineStats stats={statistics} view="statistics" />
          )}
        </div>
      )}
    </section>
  );
}
