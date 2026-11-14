import { atom } from 'jotai';
import Statistics from '@components/statistics/Statistics';

export const state = atom<Statistics>(new Statistics());

export default state;
