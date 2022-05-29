import { atom } from 'recoil';
import { WeaponQualities } from '@components/weapons/types';

export type SelectedQuality = WeaponQualities;

const state = atom<SelectedQuality>({
  key: 'SelectedQuality',
  default: WeaponQualities.Epic,
});

export default state;