import { atom } from 'recoil';
import Statistics from '@components/statistics/Statistics';

export const state = atom<Statistics>({
  key: 'Statistics',
  default: new Statistics(),
});

export default state;