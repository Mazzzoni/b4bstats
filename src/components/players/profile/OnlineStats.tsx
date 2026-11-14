import { useEffect } from 'react';
import { Provider, useAtomValue, useSetAtom } from 'jotai';
import type Statistics from '@components/statistics/Statistics';
import StatisticsState from '@components/self/StatisticsState';
import SelectedProgressionTypeState from '@components/self/SelectedProgressionTypeState';
import { ProgressionTypes } from '@components/statistics/types';
import Display from '@components/self/Display';
import { AnalyzerExportContext } from '@components/common/ScreenshotTaker';
import { LoadingState } from '../Common';

function HydratedOnlineStats({
  stats,
  view,
}: {
  stats: Statistics;
  view: 'statistics' | 'progression';
}) {
  const setStats = useSetAtom(StatisticsState);
  const setProgression = useSetAtom(SelectedProgressionTypeState);
  const current = useAtomValue(StatisticsState);

  useEffect(() => {
    setStats(stats);
    setProgression(ProgressionTypes.Merged);
  }, [stats, setStats, setProgression]);
  return current.hydrated ? (
    <Display view={view} difficultyFilters={{ showLegendary: true }} />
  ) : (
    <LoadingState />
  );
}

export default function OnlineStats({
  stats,
  view,
}: {
  stats: Statistics;
  view: 'statistics' | 'progression';
}) {
  return (
    <AnalyzerExportContext.Provider value={false}>
      <Provider>
        <HydratedOnlineStats stats={stats} view={view} />
      </Provider>
    </AnalyzerExportContext.Provider>
  );
}
