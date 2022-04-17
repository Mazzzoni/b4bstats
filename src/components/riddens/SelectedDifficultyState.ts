import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { Difficulties } from '@components/statistics/types';

const {persistAtom} = recoilPersist();

export type SelectedDifficulty = Difficulties

const state = atom<SelectedDifficulty>({
  key: 'SelectedDifficulty',
  default: Difficulties.Easy,
  effects_UNSTABLE: [persistAtom],
});

export default state;