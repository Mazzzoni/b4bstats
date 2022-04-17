type WeakspotZone = {
  health: number
  weakspot_multiplier: number
  body_damage: number
}

export type RiddenDefinition = {
  name: string
  category: 'Commons' | 'Stingers' | 'Reekers' | 'Tallboys' | 'Specials' | 'Bosses'
  image: string
  health: number | { [key: string]: number }
  weakspot_multiplier?: number
  stumble?: {
    health: number | string,
    recovery: number,
    weakspot_multiplier?: number | { [key: string]: number },
  }
  note?: string

  weakspot_back?: WeakspotZone
  weakspot_chest?: WeakspotZone
  weakspot_legs?: WeakspotZone

  // Used by Abomination only
  weakspot_head?: WeakspotZone
  weakspot_body?: WeakspotZone
}

export type RiddenProps = {
  // Contain specific difficulty notes (as markdown)
  notes: {
    easy: string,
    normal: string,
    hard: string,
    veryhard: string,
    pvp: string,
  },
  // Contains every ridden definition for each difficulty
  riddens: {
    easy: RiddenDefinition[],
    normal: RiddenDefinition[],
    hard: RiddenDefinition[],
    veryhard: RiddenDefinition[],
    pvp: RiddenDefinition[],
  }
}