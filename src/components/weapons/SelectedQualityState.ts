import { atom } from 'jotai';
import { WeaponQualities } from '@components/weapons/types';

export type SelectedQuality = WeaponQualities;

const state = atom<SelectedQuality>(WeaponQualities.Epic);

export default state;
