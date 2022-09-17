import { Difficulties } from '@components/statistics/types';

export enum RiddenCategories
{
  Commons = 'commons',
  Stingers = 'stingers',
  Reekers = 'reekers',
  Tallboys = 'tallboys',
  Cultists = 'cultists',
  Specials = 'specials',
  Bosses = 'bosses',
}

type WeakspotZone = {
  health: number;
  weakspot_multiplier: number;
  body_damage: number;
};

export type RiddenDefinition = {
  name: string;
  category: RiddenCategories;
  image: string;
  health: number | { [key: string]: number };
  weakspot_multiplier?: number;
  stumble?: {
    health: number | string;
    recovery: number;
    weakspot_multiplier?: number | { [key: string]: number };
  };
  note?: string;

  weakspot_back?: WeakspotZone;
  weakspot_chest?: WeakspotZone;
  weakspot_legs?: WeakspotZone;

  // Used by Abomination only
  weakspot_head?: WeakspotZone;
  weakspot_body?: WeakspotZone;
};

export type RiddensProps = {
  // Contain specific difficulty notes (as markdown)
  notes: {
    [Difficulties.Recruit]: string;
    [Difficulties.Veteran]: string;
    [Difficulties.Nightmare]: string;
    [Difficulties.NoHope]: string;
    [Difficulties.Swarm]: string;
  };

  // Contains every ridden definition for each difficulty
  riddens: {
    [Difficulties.Recruit]: RiddenDefinition[];
    [Difficulties.Veteran]: RiddenDefinition[];
    [Difficulties.Nightmare]: RiddenDefinition[];
    [Difficulties.NoHope]: RiddenDefinition[];
    [Difficulties.Swarm]: RiddenDefinition[];
  };
};