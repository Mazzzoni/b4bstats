// Run script with:
// http://localhost:3000/api/parse-weapons

import * as fs from 'fs';
import { WeaponCategories, WeaponDefinition, WeaponQualities, WeaponRpmFormula, WeaponStatisticsDefinition } from '@components/weapons/types';
import { NextApiRequest, NextApiResponse } from 'next';
import xlsx from 'node-xlsx';
import { weaponToString } from '@translations/helpers';
import { burstCount, WeaponsMap } from '@components/weapons/WeaponsMap';
import { getDamageData, getMetersScale, meleeStepSize, rangedStepSize } from '@components/weapons/utils';
import _ from 'lodash';

const file = `${process.cwd()}/data/weapons/sheets/trs-weapons.xlsm`;

enum RangedWeaponsColumns
{
  TrueDps = 3,
  FullClipDamage = 4,
  TimeToReload = 7,
  StumblePerShot = 8,
  StumblePerSecond = 9,
  DelayBetweenShots = 11,
  DelayBetweenBursts = 12,
  RechamberLength = 14,
  RechamberAnimationLength = 15,
  WeakspotDamageMultiplier = 19,
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
  ShotgunRange1 = 37,
  ShotgunRangeDamage1 = 35,
  ShotgunRange2 = 40,
  ShotgunRangeDamage2 = 38,
  ShotgunRange3 = 43,
  ShotgunRangeDamage3 = 41,
  ShotgunRange4 = 46,
  ShotgunRangeDamage4 = 44,
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
  public parse(): void
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

        const pellets = data[RangedWeaponsColumns.PelletCount] ? data[RangedWeaponsColumns.PelletCount] : 1;

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

        let shotgunRangeDamages: { [key: string]: number } = {};

        if (weapon.category === WeaponCategories.Shotgun) {
          if (data[RangedWeaponsColumns.ShotgunRange1] && data[RangedWeaponsColumns.ShotgunRangeDamage1]) {
            shotgunRangeDamages[data[RangedWeaponsColumns.ShotgunRange1]] = data[RangedWeaponsColumns.ShotgunRangeDamage1];
          }

          if (data[RangedWeaponsColumns.ShotgunRange2] && data[RangedWeaponsColumns.ShotgunRangeDamage2]) {
            shotgunRangeDamages[data[RangedWeaponsColumns.ShotgunRange2]] = data[RangedWeaponsColumns.ShotgunRangeDamage2];
          }

          if (data[RangedWeaponsColumns.ShotgunRange3] && data[RangedWeaponsColumns.ShotgunRangeDamage3]) {
            shotgunRangeDamages[data[RangedWeaponsColumns.ShotgunRange3]] = data[RangedWeaponsColumns.ShotgunRangeDamage3];
          }

          if (data[RangedWeaponsColumns.ShotgunRange4] && data[RangedWeaponsColumns.ShotgunRangeDamage4]) {
            shotgunRangeDamages[data[RangedWeaponsColumns.ShotgunRange4]] = data[RangedWeaponsColumns.ShotgunRangeDamage4];
          }

          // Compute real shotgun damage
          let i = 0;

          for (const range of Object.keys(shotgunRangeDamages)) {
            shotgunRangeDamages[range] = pellets * shotgunRangeDamages[range] + Object.values(rangeDamages)[i];

            i++;
          }
        }

        const metersScale = getMetersScale(4000, rangedStepSize);

        const rangeDamagesComputed = getDamageData(
          weapon.category === WeaponCategories.Shotgun
            ? shotgunRangeDamages
            : rangeDamages,
          metersScale,
        );

        const delayBetweenShots = data[RangedWeaponsColumns.DelayBetweenShots];
        const delayBetweenBursts = data[RangedWeaponsColumns.DelayBetweenBursts];

        const weaponStatistics = {
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
          rechamberLength: data[RangedWeaponsColumns.RechamberLength],
          rechamberAnimationLength: data[RangedWeaponsColumns.RechamberAnimationLength],
          weakspotDamageMultiplier: data[RangedWeaponsColumns.WeakspotDamageMultiplier],
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
        } as WeaponStatisticsDefinition;

        const [rpm, rpmFormula] = this.getRpmByWeapon(weapon.rpmFormula!, weaponStatistics);

        weaponStatistics.rpm = rpm;
        weaponStatistics.rpmFormula = rpmFormula;

        if (weapon.category === WeaponCategories.Shotgun) {
          weaponStatistics.shotgunRangeDamages = shotgunRangeDamages;
        }

        computedWeapon.qualities[quality as WeaponQualities] = weaponStatistics;
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

    this.computeUpgrades();
  }

  /**
   * Check whether statistics are upgrading when you switch quality
   */
  private computeUpgrades(): void
  {
    this.weapons.forEach((weapon) => {
      // by default, no upgrades at all
      const upgrades: WeaponDefinition['upgrades'] = {
        bulletPenetrationMultiplier: false,
        magazineSize: false,
        'movementSpeed.jog': false,
        'movementSpeed.hipfire': false,
        'movementSpeed.ads': false,
        'movementSpeed.other': false,
        'ads.in': false,
        'ads.out': false,
        'swap.in': false,
        'swap.out': false,
        reloadSpeed: false,
        stumblePowerMultiplier: false,
        weakspotDamageMultiplier: false,
      };

      const qualities = Object.keys(weapon.qualities);

      // if there's only one quality then the weapon can't upgrade
      if (qualities.length === 1) {
        weapon.upgrades = upgrades;

        return;
      }

      let previousWeaponQuality = null;

      for (const quality of qualities) {
        const currentWeaponQuality = weapon.qualities[quality as WeaponQualities];

        if (!previousWeaponQuality) {
          previousWeaponQuality = currentWeaponQuality;

          continue;
        }

        for (const upgrade of Object.keys(upgrades)) {
          const previousValue = _.get(previousWeaponQuality, upgrade);
          const currentValue = _.get(currentWeaponQuality, upgrade);

          // if values don't match then it means the weapon gets an upgrade in some way (positive or negative)
          if (previousValue !== currentValue) {
            upgrades[upgrade as keyof WeaponStatisticsDefinition] = true;
          }
        }

        previousWeaponQuality = currentWeaponQuality;
      }

      weapon.upgrades = upgrades;
    });
  }

  /**
   * Determine the RPM and the RPM formula for a given weapon and based on its statistics
   */
  private getRpmByWeapon(rpmFormula: WeaponRpmFormula, weaponStatistics: WeaponStatisticsDefinition): [number, string]
  {
    switch (rpmFormula) {
      case WeaponRpmFormula.Default:
        return [
          (1 / weaponStatistics.delayBetweenShots * 60),
          '(1 / delayBetweenShots * 60)',
        ];

      case WeaponRpmFormula.Burst:
        return [
          (60 * burstCount / (weaponStatistics.delayBetweenShots * burstCount + weaponStatistics.delayBetweenBursts)),
          '(60 * burstCount / (delayBetweenShots * burstCount + delayBetweenBursts))',
        ];

      case WeaponRpmFormula.TAC14:
        return [
          (60 / (weaponStatistics.rechamberLength + weaponStatistics.reloadSpeed / 3)),
          '(60 / (rechamberLength + reloadSpeed / 3))',
        ];

      case WeaponRpmFormula.TheBelgian:
        return [
          (60 / (weaponStatistics.rechamberLength + weaponStatistics.reloadSpeed)),
          '(60 / (rechamberLength + reloadSpeed))',
        ];

      case WeaponRpmFormula.Rechamber:
        return [
          (60 / (weaponStatistics.delayBetweenShots + 0.1 + weaponStatistics.rechamberLength)),
          '(60 / (delayBetweenShots + 0.1 + rechamberLength))',
        ];
    }

    throw Error(`Unknown RPM formula passed (${rpmFormula})`);
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const saver = new Saver();
  const parser = new Parser();

  parser.parse();
  saver.save(Array.from(parser.weapons.values()));

  res.status(200).json({message: 'Parsing done'});
}