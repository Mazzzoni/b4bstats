export enum WeaponRarities
{
  Common = 'common',
  Uncommon = 'uncommon',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary',
}

export enum WeaponCategories
{
  AssaultRifles = 'assault_rifle',
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

export type WeaponStatisticsDefinition = {
  rpm: number
  range_damages: Record<string, number>
  magazine_size: number
  reload_speed: number
  stumble_power_multiplier: number
  bullet_penetration_multiplier: number
  movement_speed: {
    jog: number
    hipfire: number
    ads: number
    other: number
  }
  ads: {
    in: number
    out: number
  }
  swap: {
    in: number
    out: number
  }
}

export type WeaponDefinition = {
  name: string
  category: WeaponCategories
  image: string
  slot: 'primary' | 'secondary' | 'n/a'
  ammo: 'rifle' | 'pistol_smg' | 'shotgun' | 'sniper'
  attachments: {
    barrel: boolean
    magazine: boolean
    scope: boolean
    stock: boolean
  }
  pellets: number
  qualities: Record<WeaponRarities, WeaponStatisticsDefinition>
}

export type AttachmentDefinition = {
  name: string
  category: AttachmentCategories
  effects: Record<AttachmentEffect, number>
}

export type WeaponsProps = {
  note: string
  weapons: WeaponDefinition[]
  attachments: AttachmentDefinition[]
}
