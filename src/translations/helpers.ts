import { localeFormat } from '@utils/generic';
import { Weapons, WeaponTypes } from '@components/statistics/types';

export function translateKillsTooltip(t: Function, count: number, percent: number)
{
  return t('graphs.labels.x_kills', {
    count: localeFormat(count),
    percent: percent,
  });
}

export function translateMissionsTooltip(t: Function, count: number, percent: number)
{
  return t('graphs.labels.x_missions', {
    count: localeFormat(count),
    percent: percent,
  });
}

export function weaponTypeToString(weaponType: WeaponTypes): string
{
  switch (weaponType) {
    case WeaponTypes.Melee:
      return 'MELEE';
    case WeaponTypes.AssaultRifle:
      return 'ASSAULT_RIFLE';
    case WeaponTypes.Handgun:
      return 'HANDGUN';
    case WeaponTypes.Shotgun:
      return 'SHOTGUN';
    case WeaponTypes.SMG:
      return 'SMG';
    case WeaponTypes.LMG:
      return 'LMG';
    case WeaponTypes.Sniper:
      return 'SNIPER';
  }

  return 'unknown';
}

export function weaponToString(weapon: Weapons): string
{
  switch (weapon) {
    case Weapons.Axe:
      return 'Axe';
    case Weapons.Bat:
      return 'Bat';
    case Weapons.BobArm:
      return 'bobarm';
    case Weapons.Fist:
      return 'Fist';
    case Weapons.SkullTotem:
      return 'SkullTotem';
    case Weapons.Hatchet:
      return 'Hatchet';
    case Weapons.Machete:
      return 'Machete';
    case Weapons.Knife:
      return 'Knife';
    case Weapons.Tenderizer:
      return 'FireAxeCorrupted';

    case Weapons.M4Carbine:
      return 'AR01';
    case Weapons.AK47:
      return 'AR02';
    case Weapons.M16:
      return 'AR04';
    case Weapons.Scar:
      return 'AR05';
    case Weapons.RanchRifle:
      return 'AR06';
    case Weapons.Pestilence:
      return 'AR01Corrupted';

    case Weapons.M1911:
      return 'HG01';
    case Weapons.BerettaM9:
      return 'HG02';
    case Weapons.BerettaM9Burst:
      return 'hg02b';
    case Weapons.Magnum357:
      return 'HG03';
    case Weapons.Glock23:
      return 'HG04';
    case Weapons.Glock23Burst:
      return 'hg04b';
    case Weapons.DesertEagle:
      return 'HG05';
    case Weapons.Embezzler:
      return 'HG05Corrupted';

    case Weapons.Express870:
      return 'SG01';
    case Weapons.AA12:
      return 'SG02';
    case Weapons.TheBelgian:
      return 'SG03';
    case Weapons.TAC14:
      return 'SG04';
    case Weapons.Super90:
      return 'SG05';
    case Weapons.Damnation:
      return 'SG02Corrupted';

    case Weapons.MP5:
      return 'SMG01';
    case Weapons.UZI:
      return 'SMG02';
    case Weapons.TEC9:
      return 'SMG03';
    case Weapons.UMP45:
      return 'SMG04';
    case Weapons.Vector:
      return 'SMG05';
    case Weapons.Prototype378:
      return 'SMG04Corrupted';

    case Weapons.M249:
      return 'LMG01';
    case Weapons.RPK:
      return 'LMG02';
    case Weapons.Nemesis:
      return 'LMG02Corrupted';

    case Weapons.M1A:
      return 'AR03';
    case Weapons.Phoenix350L:
      return 'Sni01';
    case Weapons.BarrettM95:
      return 'Sni02';
    case Weapons.Witness:
      return 'AR03Corrupted';
  }

  return 'unknown';
}