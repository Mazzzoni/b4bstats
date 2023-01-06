// Run script with:
// http://localhost:3000/api/parse-weapons

import * as fs from 'fs';
import { WeaponCategories, WeaponDefinition, WeaponQualities, WeaponRpmFormulas, WeaponStatisticsDefinition } from '@components/weapons/types';
import { NextApiRequest, NextApiResponse } from 'next';
import xlsx from 'node-xlsx';
import { weaponToString } from '@translations/helpers';
import { burstCount, WeaponsMap } from '@components/weapons/WeaponsMap';
import { getDamageData, getMetersScale, meleeStepSize, rangedStepSize } from '@components/weapons/utils';
import _ from 'lodash';

const file = `${process.cwd()}/data/weapons/sheets/weapons-2022-12-06.xlsm`;

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
  MeleeStateLength = 26,
  MeleeStateInterruptLength = 27,
  MeleeImpactStateLength = 28,
  MoveSpeedBase = 84,
  MoveSpeedAds = 87,
  MoveSpeedHipFire = 90,
  MoveSpeedOther = 93,
  SwapSpeedRaise = 113,
  SwapSpeedLower = 114,
}

enum BowWeaponsColumns
{
  StaminaCost = 1,
  StaminaCostPerSecond = 3,
  MoveSpeedBase = 32,
  MoveSpeedAds = 35,
  MoveSpeedHipFire = 38,
  MoveSpeedOther = 41,
  SwapSpeedRaise = 58,
  SwapSpeedLower = 61,
  AdsSpeedIn = 63,
  AdsSpeedOut = 64,
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
    const bows = workSheets[2];

    // TODO: Parse flamethrowers sheet
    const flamethrowers = workSheets[3];

    this.parseRangedWeapons(guns);
    this.parseMeleeWeapons(melees);
    this.parseBowWeapons(bows);

    this.computeUpgrades();
  }

  private parseRangedWeapons(guns: { name: string; data: unknown[] })
  {
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
  }

  private parseMeleeWeapons(melees: { name: string; data: unknown[] })
  {
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

        const range = data[MeleeWeaponsColumns.TraceLength];

        let rangeDamages: { [key: string]: number } = {
          [range]: data[MeleeWeaponsColumns.LightAttackDamage],
          [range + 1]: 0,
        };

        const pellets = 1;
        const metersScale = getMetersScale(300, meleeStepSize);
        const rangeDamagesComputed = getDamageData(rangeDamages, metersScale).map((dmg) => dmg * pellets);

        // Weapon statistics definition is a bit different for melee category
        const weaponStatistics = {
          rangeDamages: rangeDamages,
          rangeDamagesComputed: rangeDamagesComputed,
          metersScale: metersScale,
          stamina: data[MeleeWeaponsColumns.StaminaCost],
          meleeStateLength: data[MeleeWeaponsColumns.MeleeStateLength],
          meleeStateInterruptLength: data[MeleeWeaponsColumns.MeleeStateInterruptLength],
          meleeImpactStateLength: data[MeleeWeaponsColumns.MeleeImpactStateLength],
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

        const [rpm, rpmFormula] = this.getRpmByWeapon(weapon.rpmFormula!, weaponStatistics);

        weaponStatistics.rpm = rpm;
        weaponStatistics.rpmFormula = rpmFormula;

        // Compute weapon DPS & SPS
        weaponStatistics.trueDps = (weaponStatistics.rangeDamagesComputed[0] * weaponStatistics.rpm) / 60;
        weaponStatistics.stumblePerSecond = (weaponStatistics.stumblePerShot * weaponStatistics.rpm) / 60;

        computedWeapon.qualities[quality as WeaponQualities] = weaponStatistics;
      }

      this.weapons.set(computedWeapon.name, computedWeapon);
    }
  }

  private parseBowWeapons(bows: { name: string; data: unknown[] })
  {
    for (const weapon of WeaponsMap.Bow) {
      const computedWeapon: WeaponDefinition = {} as WeaponDefinition;

      computedWeapon.name = weaponToString(weapon.name);
      computedWeapon.category = weapon.category!;
      computedWeapon.image = weapon.image!;
      computedWeapon.slot = weapon.slot!;
      computedWeapon.ammo = weapon.ammo;

      if (weapon.notes) {
        computedWeapon.notes = weapon.notes;
      }

      computedWeapon.qualities = {} as WeaponDefinition['qualities'];

      for (const quality in weapon.qualities) {
        // Subtract one to get the actual row number
        const row = weapon.qualities[quality as WeaponQualities]! - 1;
        const data = bows.data[row] as any[];

        // FIXME: No idea of the range of the bow
        const range = 4000;

        let rangeDamages: { [key: string]: number } = {
          // FIXME: No idea of how damages are computed, spreadsheet don't seems to refer to any firepower, taking value from wiki
          [range]: 80,
          [range + 1]: 0,
        };

        const pellets = 1;
        const metersScale = getMetersScale(4000, meleeStepSize);
        const rangeDamagesComputed = getDamageData(rangeDamages, metersScale).map((dmg) => dmg * pellets);

        // Weapon statistics definition is a bit different for melee category
        const weaponStatistics = {
          rangeDamages: rangeDamages,
          rangeDamagesComputed: rangeDamagesComputed,
          metersScale: metersScale,
          stamina: data[BowWeaponsColumns.StaminaCost],
          pellets: pellets,
          swap: {
            in: data[BowWeaponsColumns.SwapSpeedRaise],
            out: data[BowWeaponsColumns.SwapSpeedLower],
          },
          ads: {
            in: data[BowWeaponsColumns.AdsSpeedIn],
            out: data[BowWeaponsColumns.AdsSpeedOut],
          },
          movementSpeed: {
            jog: data[BowWeaponsColumns.MoveSpeedBase],
            ads: data[BowWeaponsColumns.MoveSpeedAds],
            hipfire: data[BowWeaponsColumns.MoveSpeedHipFire],
            other: data[BowWeaponsColumns.MoveSpeedOther],
          },
        } as WeaponStatisticsDefinition;

        const [rpm, rpmFormula] = this.getRpmByWeapon(weapon.rpmFormula!, weaponStatistics);

        weaponStatistics.rpm = rpm;
        weaponStatistics.rpmFormula = rpmFormula;

        // TODO: Nice to have -> TrueDPS & Stumble values

        computedWeapon.qualities[quality as WeaponQualities] = weaponStatistics;
      }

      this.weapons.set(computedWeapon.name, computedWeapon);
    }
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
  private getRpmByWeapon(rpmFormula: WeaponRpmFormulas, weaponStatistics: WeaponStatisticsDefinition): [number, string]
  {
    switch (rpmFormula) {
      case WeaponRpmFormulas.Default:
        return [
          (1 / weaponStatistics.delayBetweenShots * 60),
          '(1 / delayBetweenShots * 60)',
        ];

      case WeaponRpmFormulas.Burst:
        return [
          (60 * burstCount / (weaponStatistics.delayBetweenShots * burstCount + weaponStatistics.delayBetweenBursts)),
          '(60 * burstCount / (delayBetweenShots * burstCount + delayBetweenBursts))',
        ];

      case WeaponRpmFormulas.Rechamber:
        return [
          (60 / (weaponStatistics.delayBetweenShots + 0.1 + weaponStatistics.rechamberLength)),
          '(60 / (delayBetweenShots + 0.1 + rechamberLength))',
        ];

      case WeaponRpmFormulas.Melee:
        return [
          (60 / (weaponStatistics.meleeStateLength! * weaponStatistics.meleeStateInterruptLength! + 0.05)),
          '(60 / (meleeStateLength * meleeStateInterruptLength + 0.05))',
        ];

      case WeaponRpmFormulas.Bow:
        return [
          0,
          'Unknown',
        ];

      case WeaponRpmFormulas.TAC14:
        return [
          (60 / (weaponStatistics.rechamberLength + weaponStatistics.reloadSpeed / 3)),
          '(60 / (rechamberLength + reloadSpeed / 3))',
        ];

      case WeaponRpmFormulas.TheBelgian:
        return [
          (60 / (weaponStatistics.rechamberLength + weaponStatistics.reloadSpeed)),
          '(60 / (rechamberLength + reloadSpeed))',
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