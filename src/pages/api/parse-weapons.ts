// Run script with:
// http://localhost:3000/api/parse-weapons

import * as fs from 'fs';
import { WeaponDefinition, WeaponQualities, WeaponStatisticsDefinition } from '@components/weapons/types';
import { NextApiRequest, NextApiResponse } from 'next';
import xlsx from 'node-xlsx';
import { weaponToString } from '@translations/helpers';
import { WeaponsMap } from '@components/weapons/WeaponsMap';
import { getDamageData, getMetersScale, meleeStepSize, rangedStepSize } from '@components/weapons/utils';

const file = `${process.cwd()}/data/weapons/sheets/trs-weapons.xlsm`;

// All weapons that fire in bursts, shot 3 times (Beretta M9 / M16)
const burstCount = 3;

enum RangedWeaponsColumns
{
  TrueDps = 3,
  FullClipDamage = 4,
  TimeToReload = 7,
  StumblePerShot = 8,
  StumblePerSecond = 9,
  DelayBetweenShots = 11,
  DelayBetweenBursts = 12,
  StumbleDamageRatio = 21,
  Range1 = 24,
  RangeDamage1 = 22,
  Range2 = 27,
  RangeDamage2 = 25,
  Range3 = 30,
  RangeDamage3 = 28,
  Range4 = 33,
  RangeDamage4 = 31,
  PelletCount = 34,
  MaxClipAmount = 71,
  BulletPenetrationPower = 195,
  MoveSpeedBase = 197,
  MoveSpeedAds = 200,
  MoveSpeedHipFire = 203,
  MoveSpeedOther = 206,
  SwapSpeedRaise = 223,
  SwapSpeedLower = 226,
  AdsSpeedIn = 228,
  AdsSpeedOut = 229,
}

enum MeleeWeaponsColumns
{
  LightAttackDamage = 1,
  LightStumbleDamageScale = 3,
  StaminaCost = 9,
  TraceLength = 15,
  MoveSpeedBase = 74,
  MoveSpeedAds = 77,
  MoveSpeedHipFire = 80,
  MoveSpeedOther = 83,
  SwapSpeedRaise = 100,
  SwapSpeedLower = 103,
}

class Saver
{
  save(weapons: WeaponDefinition[]): void
  {
    const file = `${process.cwd()}/data/weapons/weapons.json`;

    fs.writeFileSync(file, JSON.stringify(weapons, null, 2));
  }
}

class Parser
{
  public weapons: Map<WeaponDefinition['name'], WeaponDefinition> = new Map<WeaponDefinition['name'], WeaponDefinition>();

  /**
   * Parse weapons and extract data from document
   * Also compute damage right away, so it saves a bit of performance on client side
   */
  parse(): void
  {
    if (!fs.existsSync(file)) {
      throw new Error('Make sure to have actual document file available');
    }

    const workSheets = xlsx.parse(fs.readFileSync(file));
    const guns = workSheets[0];
    const melees = workSheets[1];

    for (const weapon of WeaponsMap.Ranged) {
      const computedWeapon: WeaponDefinition = {} as WeaponDefinition;

      computedWeapon.name = weaponToString(weapon.name);
      computedWeapon.category = weapon.category!;
      computedWeapon.image = weapon.image!;
      computedWeapon.slot = weapon.slot!;
      computedWeapon.ammo = weapon.ammo;
      computedWeapon.attachments = weapon.attachments
        ? weapon.attachments
        : {
          barrel: false,
          magazine: false,
          scope: false,
          stock: false,
        };

      if (weapon.notes) {
        computedWeapon.notes = weapon.notes;
      }

      computedWeapon.qualities = {} as WeaponDefinition['qualities'];

      for (const quality in weapon.qualities) {
        // Subtract one to get the actual row number
        const row = weapon.qualities[quality as WeaponQualities]! - 1;
        const data = guns.data[row] as any[];

        let rangeDamages: { [key: string]: number } = {};

        if (data[RangedWeaponsColumns.Range1] && data[RangedWeaponsColumns.RangeDamage1]) {
          rangeDamages[data[RangedWeaponsColumns.Range1]] = data[RangedWeaponsColumns.RangeDamage1];
        }

        if (data[RangedWeaponsColumns.Range2] && data[RangedWeaponsColumns.RangeDamage2]) {
          rangeDamages[data[RangedWeaponsColumns.Range2]] = data[RangedWeaponsColumns.RangeDamage2];
        }

        if (data[RangedWeaponsColumns.Range3] && data[RangedWeaponsColumns.RangeDamage3]) {
          rangeDamages[data[RangedWeaponsColumns.Range3]] = data[RangedWeaponsColumns.RangeDamage3];
        }

        if (data[RangedWeaponsColumns.Range4] && data[RangedWeaponsColumns.RangeDamage4]) {
          rangeDamages[data[RangedWeaponsColumns.Range4]] = data[RangedWeaponsColumns.RangeDamage4];
        }

        const pellets = data[RangedWeaponsColumns.PelletCount] ? data[RangedWeaponsColumns.PelletCount] : 1;
        const metersScale = getMetersScale(4000, rangedStepSize);
        const rangeDamagesComputed = getDamageData(rangeDamages, metersScale).map((dmg) => dmg * pellets);

        const delayBetweenShots = data[RangedWeaponsColumns.DelayBetweenShots];
        const delayBetweenBursts = data[RangedWeaponsColumns.DelayBetweenBursts];

        // Apply default formula by default
        let rpm = 1 / delayBetweenShots * 60;

        // If weapon fires in bursts, change formula
        if (delayBetweenBursts !== 0) {
          rpm = 60 * burstCount / (delayBetweenShots * burstCount + delayBetweenBursts);
        }

        computedWeapon.qualities[quality as WeaponQualities] = {
          rpm: rpm,
          delayBetweenShots: delayBetweenShots,
          delayBetweenBursts: delayBetweenBursts,
          pellets: pellets,
          fullMagazineDamage: data[RangedWeaponsColumns.FullClipDamage],
          trueDps: data[RangedWeaponsColumns.TrueDps],
          stumblePerShot: data[RangedWeaponsColumns.StumblePerShot],
          stumblePerSecond: data[RangedWeaponsColumns.StumblePerSecond],
          rangeDamages: rangeDamages,
          rangeDamagesComputed: rangeDamagesComputed,
          metersScale: metersScale,
          bulletPenetrationMultiplier: data[RangedWeaponsColumns.BulletPenetrationPower],
          magazineSize: data[RangedWeaponsColumns.MaxClipAmount],
          reloadSpeed: data[RangedWeaponsColumns.TimeToReload],
          stumblePowerMultiplier: data[RangedWeaponsColumns.StumbleDamageRatio],
          movementSpeed: {
            jog: data[RangedWeaponsColumns.MoveSpeedBase],
            ads: data[RangedWeaponsColumns.MoveSpeedAds],
            hipfire: data[RangedWeaponsColumns.MoveSpeedHipFire],
            other: data[RangedWeaponsColumns.MoveSpeedOther],
          },
          ads: {
            in: data[RangedWeaponsColumns.AdsSpeedIn],
            out: data[RangedWeaponsColumns.AdsSpeedOut],
          },
          swap: {
            in: data[RangedWeaponsColumns.SwapSpeedRaise],
            out: data[RangedWeaponsColumns.SwapSpeedLower],
          },
        };
      }

      this.weapons.set(computedWeapon.name, computedWeapon);
    }

    for (const weapon of WeaponsMap.Melee) {
      const computedWeapon: WeaponDefinition = {} as WeaponDefinition;

      computedWeapon.name = weaponToString(weapon.name);
      computedWeapon.category = weapon.category!;
      computedWeapon.image = weapon.image!;
      computedWeapon.slot = weapon.slot!;

      if (weapon.notes) {
        computedWeapon.notes = weapon.notes;
      }

      computedWeapon.qualities = {} as WeaponDefinition['qualities'];

      for (const quality in weapon.qualities) {
        // Subtract one to get the actual row number
        const row = weapon.qualities[quality as WeaponQualities]! - 1;
        const data = melees.data[row] as any[];

        let rangeDamages: { [key: string]: number } = {
          [data[MeleeWeaponsColumns.TraceLength]]: data[MeleeWeaponsColumns.LightAttackDamage],
          [data[MeleeWeaponsColumns.TraceLength] + 1]: 0,
        };

        const pellets = 1;
        const metersScale = getMetersScale(300, meleeStepSize);
        const rangeDamagesComputed = getDamageData(rangeDamages, metersScale).map((dmg) => dmg * pellets);

        // Weapon statistics definition is a bit different for melee category
        computedWeapon.qualities[quality as WeaponQualities] = {
          // TODO: Find how RPM (HPM) is computed
          rpm: 0,
          // TODO: Find how DPS is computed
          trueDps: 0,
          rangeDamages: rangeDamages,
          rangeDamagesComputed: rangeDamagesComputed,
          metersScale: metersScale,
          stamina: data[MeleeWeaponsColumns.StaminaCost],
          stumblePowerMultiplier: data[MeleeWeaponsColumns.LightStumbleDamageScale],
          stumblePerShot: data[MeleeWeaponsColumns.LightAttackDamage] * data[MeleeWeaponsColumns.LightStumbleDamageScale],
          pellets: pellets,
          swap: {
            in: data[MeleeWeaponsColumns.SwapSpeedRaise],
            out: data[MeleeWeaponsColumns.SwapSpeedLower],
          },
          movementSpeed: {
            jog: data[MeleeWeaponsColumns.MoveSpeedBase],
            ads: data[MeleeWeaponsColumns.MoveSpeedAds],
            hipfire: data[MeleeWeaponsColumns.MoveSpeedHipFire],
            other: data[MeleeWeaponsColumns.MoveSpeedOther],
          },
        } as WeaponStatisticsDefinition;
      }

      this.weapons.set(computedWeapon.name, computedWeapon);
    }
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const saver = new Saver();
  const parser = new Parser();

  parser.parse();
  saver.save(Array.from(parser.weapons.values()));

  res.status(200).json({message: 'Parsing done'});
}