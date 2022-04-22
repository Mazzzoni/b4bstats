import { atom } from 'recoil';
import Statistics from '@components/statistics/Statistics';
import { AllStatistics } from '@components/statistics/types';

export const AllStatisticsState = atom<AllStatistics>({
  key: 'AllStatistics',
  default: {
    onlineStatistics: new Statistics(),
    offlineStatistics: new Statistics(),
    mergedStatistics: new Statistics()
  }
})

export const state = atom<Statistics>({
  key: 'Statistics',
  default: new Statistics(),
})

export default state;