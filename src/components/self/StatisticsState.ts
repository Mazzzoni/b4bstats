import { atom } from 'recoil';
import Statistics from '@components/statistics/Statistics';

const state = atom<Statistics>({
  key: 'Statistics',
  default: new Statistics(),
});

export default state;