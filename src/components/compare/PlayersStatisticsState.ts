import { atom } from 'recoil';
import Statistics from '@components/statistics/Statistics';

export type PlayersStatistics = {
  player: string
  stats: Statistics
}

const state = atom<PlayersStatistics[]>({
  key: 'PlayersStatistics',
  default: [],
});

export default state;