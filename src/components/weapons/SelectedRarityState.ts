import { atom } from 'recoil';
import { WeaponRarities } from '@components/weapons/types';

export type SelectedRarity = WeaponRarities

const state = atom<SelectedRarity>({
  key: 'SelectedRarity',
  default: WeaponRarities.Common,
});

export default state;