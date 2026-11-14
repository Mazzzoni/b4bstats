import { atomWithStorage } from 'jotai/utils';

export type DifficultyFilters = {
  showRecruit: boolean;
  showVeteran: boolean;
  showNightmare: boolean;
  showNoHope: boolean;
  showLegendary: boolean;
  showSwarm: boolean;
};

const state = atomWithStorage<DifficultyFilters>('b4bstats:DifficultyFilters', {
  showRecruit: false,
  showVeteran: false,
  showNightmare: true,
  showNoHope: true,
  showLegendary: false,
  showSwarm: false,
});

export default state;
