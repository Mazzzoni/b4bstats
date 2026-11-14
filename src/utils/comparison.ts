import type Statistics from '@components/statistics/Statistics';
import { Cleaners, Difficulties, Missions, ProgressionTypes } from '@components/statistics/types';

/** Repeated clears count once for each cleaner, map and campaign difficulty. */
export function comparisonCompletion(statistics: Statistics) {
  const difficulties = Object.values(Difficulties).filter(
    (difficulty) => difficulty !== Difficulties.Swarm,
  );
  const cleaners = Object.values(Cleaners);
  const missions = Object.values(Missions);
  const progression = statistics.progressions[ProgressionTypes.Merged];
  let completed = 0;
  for (const cleaner of cleaners) {
    for (const difficulty of difficulties) {
      for (const mission of missions) {
        if (progression[cleaner]?.[difficulty]?.[mission]) completed++;
      }
    }
  }
  return { completed, total: cleaners.length * difficulties.length * missions.length };
}

export function perMission(value: number, missions: number): number | null {
  return Number.isFinite(value) && Number.isFinite(missions) && missions > 0
    ? value / missions
    : null;
}
