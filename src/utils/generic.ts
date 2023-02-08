import i18n from '@translations/i18n';
import { CleanerNames, Cleaners } from '@components/statistics/types';

export function getCleanerNameById(cleanerId: string): string
{
  const index = Object.values(Cleaners).indexOf(cleanerId as Cleaners);

  return Object.keys(Cleaners)[index];
}

// Change cleaners order here if needed
export const currentCleanerOrder: CleanerNames[] = [
  'Evangelo',
  'Walker',
  'Holly',
  'Mom',
  'Doc',
  'Hoffman',
  'Jim',
  'Karlee',
  'Heng',
  'Sharice',
  'Dan',
  'Tala',
];

export function getCleanerIdsByNames(cleanerNames: CleanerNames[]): Cleaners[]
{
  return cleanerNames.map((cleaner) => Cleaners[cleaner]);
}

export function localeFormat(x: number): string
{
  return x.toLocaleString(i18n.language);
}

export function nFormatter(num: number, digits: number = 0): string
{
  const lookup = [
    {value: 1, symbol: ''},
    {value: 1e3, symbol: 'k'},
    {value: 1e6, symbol: 'M'},
    {value: 1e9, symbol: 'G'},
    {value: 1e12, symbol: 'T'},
    {value: 1e15, symbol: 'P'},
    {value: 1e18, symbol: 'E'},
  ];

  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

  const item = lookup.slice().reverse().find(function (item) {
    return num >= item.value;
  });

  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
}

export function getSuggestedMaxFromArrayOfIntegers(values: number[], factor = 0.08): number
{
  const maxValue = Math.max(...values);

  return Math.round(maxValue + (maxValue * factor));
}

export function getSumFromArrayOfIntegers(values: number[]): number
{
  return values.reduce((partial_sum, a) => partial_sum + a, 0);
}

export function getFormattedDate(): string
{
  const now = new Date();

  return now.getFullYear() + '_' +
    ('0' + (now.getMonth() + 1)).slice(-2) + '_' +
    ('0' + now.getDate()).slice(-2) + '__' +
    ('0' + now.getHours()).slice(-2) + '_' +
    ('0' + now.getMinutes()).slice(-2) + '_' +
    ('0' + now.getSeconds()).slice(-2);
}