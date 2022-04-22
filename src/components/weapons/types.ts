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

export type WeaponDefinition = {
  name: string
  category: WeaponCategories
  image: string
  slot: 'primary' | 'secondary' | 'n/a'
  ammo: 'rifle' | 'pistol_smg' | 'shotgun' | 'sniper'
  rpm: number
  attachments: {
    barrel: boolean
    magazine: boolean
    scope: boolean
    stock: boolean
  }
  range_damages: Record<string, number>
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
