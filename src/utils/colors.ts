import { Difficulties, Riddens, WeaponTypes } from '@components/statistics/types';

export const WeaponColors: Record<WeaponTypes, string> = {
  [WeaponTypes.Melee]: '#b4b4b4',
  [WeaponTypes.AssaultRifle]: '#dc2424',
  [WeaponTypes.Handgun]: '#622fe5',
  [WeaponTypes.Shotgun]: '#d9ee59ff',
  [WeaponTypes.SMG]: '#04e5b2',
  [WeaponTypes.LMG]: '#d433da',
  [WeaponTypes.Sniper]: '#004386',
};

export const RiddenColors: Record<Riddens, string> = {
  [Riddens.Ogre]: '#d433da',
  [Riddens.Breaker]: '#d433da',
  [Riddens.Hag]: '#d433da',
  [Riddens.Snitcher]: '#d433da',

  [Riddens.Stinger]: '#97ff93',
  [Riddens.Stalker]: '#97ff93',
  [Riddens.Hocker]: '#97ff93',
  [Riddens.Urchin]: '#97ff93',

  [Riddens.Reeker]: '#eea713',
  [Riddens.Retch]: '#eea713',
  [Riddens.Exploder]: '#eea713',
  [Riddens.Shredder]: '#eea713',

  [Riddens.Bruiser]: '#bb0000',
  [Riddens.Crusher]: '#bb0000',
  [Riddens.Tallboy]: '#bb0000',
  [Riddens.Ripper]: '#bb0000',
};

export const DifficultyColors: Record<Difficulties, string> = {
  [Difficulties.Recruit]: '#165b00',
  [Difficulties.Veteran]: '#b47c00',
  [Difficulties.Nightmare]: '#bb0000',
  [Difficulties.NoHope]: '#8000b5',
  [Difficulties.Swarm]: '#102d7a',
};

export const PlayerColors: string[] = [
  'rgb(70,116,152)',
  'rgb(217,238,89)',
  'rgba(135,36,183)',
  'rgb(241,81,81)',
];