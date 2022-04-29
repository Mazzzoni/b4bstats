import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { ProgressionTypes } from '@components/statistics/types';

const {persistAtom} = recoilPersist();

export type SelectedProgressionType = ProgressionTypes

const state = atom<SelectedProgressionType>({
  key: 'SelectedProgressionType',
  default: ProgressionTypes.Merged,
  effects_UNSTABLE: [persistAtom],
});

export default state;