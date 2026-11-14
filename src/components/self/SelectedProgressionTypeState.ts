import { atomWithStorage } from 'jotai/utils';
import { ProgressionTypes } from '@components/statistics/types';

export type SelectedProgressionType = ProgressionTypes;

const state = atomWithStorage<SelectedProgressionType>(
  'b4bstats:SelectedProgressionType',
  ProgressionTypes.Merged,
);

export default state;
