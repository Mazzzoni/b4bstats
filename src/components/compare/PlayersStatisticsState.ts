import { atom } from 'jotai';
import Statistics from '@components/statistics/Statistics';

export type PlayersStatistics = {
  player: string;
  stats: Statistics;
};

const state = atom<PlayersStatistics[]>([]);

export default state;
