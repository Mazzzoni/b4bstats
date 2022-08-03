export enum WeaponQualities
{
  Common = 'common',
  Uncommon = 'uncommon',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary',
}

export enum WeaponCategories
{
  AssaultRifle = 'assault rifle',
  Handgun = 'handgun',
  Shotgun = 'shotgun',
  SMG = 'SMG',
  LMG = 'LMG',
  Sniper = 'sniper',
  Melee = 'melee',
}

export enum AttachmentCategories
{
  Barrel = 'barrel',
  Magazine = 'magazine',
  Scope = 'scope',
  Stock = 'stock',
}

export enum AttachmentEffect
{
  WeakspotDamage = 'weakspot_damage',
  AdsSpeed = 'ads_speed',
  BulletDamage = 'bullet_damage',
  EffectiveRange = 'EffectiveRange',
  Accuracy = 'accuracy',
  RecoilControl = 'recoil_control',
  FireRate = 'fire_rate',
  MagazineSize = 'magazine_size',
  MoveSpeedWhileFiring = 'move_speed_while_firing',
}

export enum WeaponRpmFormulas
{
  // Apply to most weapons
  Default,

  // Apply to weapons that fire in burst sequences
  Burst,

  // Apply to some weapons that have rechamber behaviours (shotguns / snipers mostly)
  Rechamber,

  // Apply to melee weapons,
  Melee,

  // Custom formulas
  TAC14,
  TheBelgian,
}

export type WeaponStatisticsDefinition = {
  rpm: number;
  rpmFormula: string;
  delayBetweenShots: number;
  delayBetweenBursts: number;
  pellets: number;
  fullMagazineDamage: number;
  trueDps: number;
  stumblePerShot: number;
  stumblePerSecond: number;
  rangeDamages: Record<string, number>;
  rangeDamagesComputed: number[];
  shotgunRangeDamages?: Record<string, number>;
  metersScale: number[];
  magazineSize: number;
  reloadSpeed: number;
  rechamberLength: number;
  rechamberAnimationLength: number;
  weakspotDamageMultiplier: number;
  stumblePowerMultiplier: number;
  bulletPenetrationMultiplier: number;
  stamina?: number;
  meleeStateLength?: number;
  meleeStateInterruptLength?: number;
  meleeImpactStateLength?: number;
  movementSpeed: {
    jog: number;
    hipfire: number;
    ads: number;
    other: number;
  };
  ads: {
    in: number;
    out: number;
  };
  swap: {
    in: number;
    out: number;
  };
};

export type WeaponDefinition = {
  name: string;
  category: WeaponCategories;
  image: string;
  slot: 'primary' | 'secondary' | 'n/a';
  ammo?: 'rifle' | 'pistol_smg' | 'shotgun' | 'sniper';
  attachments: {
    barrel: boolean;
    magazine: boolean;
    scope: boolean;
    stock: boolean;
  };
  rpmFormula: WeaponRpmFormulas;
  qualities: Record<WeaponQualities, WeaponStatisticsDefinition>;
  upgrades: Partial<Record<keyof WeaponStatisticsDefinition | string, boolean>>;
  notes?: Record<string, string>;
};

export type AttachmentDefinition = {
  name: string;
  category: AttachmentCategories;
  effects: Record<AttachmentEffect, number>;
};

export type WeaponsProps = {
  note: string;
  weapons: WeaponDefinition[];
  attachments: AttachmentDefinition[];
};
