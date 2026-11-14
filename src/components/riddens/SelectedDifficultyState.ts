import { atomWithStorage } from 'jotai/utils';
import { Difficulties } from '@components/statistics/types';

export type SelectedDifficulty = Difficulties;

const state = atomWithStorage<SelectedDifficulty>(
  'b4bstats:SelectedDifficulty',
  Difficulties.Recruit,
);

export default state;
