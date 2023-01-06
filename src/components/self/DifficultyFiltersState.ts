import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const {persistAtom} = recoilPersist();

export type DifficultyFilters = {
  showRecruit: boolean,
  showVeteran: boolean,
  showNightmare: boolean,
  showNoHope: boolean,
  showLegendary: boolean,
  showSwarm: boolean
}

const state = atom<DifficultyFilters>({
  key: 'DifficultyFilters',
  default: {
    showRecruit: false,
    showVeteran: false,
    showNightmare: true,
    showNoHope: true,
    showLegendary: false,
    showSwarm: false,
  },
  effects_UNSTABLE: [persistAtom],
});

export default state;