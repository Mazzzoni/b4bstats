import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const {persistAtom} = recoilPersist();

export type DifficultyFilters = {
  showEasy: boolean,
  showNormal: boolean,
  showHard: boolean,
  showVeryHard: boolean,
  showPvp: boolean
}

const state = atom<DifficultyFilters>({
  key: 'DifficultyFilters',
  default: {
    showEasy: false,
    showNormal: false,
    showHard: true,
    showVeryHard: true,
    showPvp: false,
  },
  effects_UNSTABLE: [persistAtom],
});

export default state;