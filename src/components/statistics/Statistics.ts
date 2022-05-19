import _ from 'lodash';
import {
  Cleaners,
  Difficulties,
  MiscellaneousStatistics,
  Missions,
  ProgressionTypes,
  Riddens,
  Weapons,
  WeaponTypes,
  MissionsCompletedPerCleaner,
  MissionsCompletedPerDifficulty,
  MissionsStatistics,
  Progressions,
  PvpStatistics,
  RiddenKilled,
  WeaponsKills,
  WeaponsSorted,
} from '@components/statistics/types';
import { isSkippableWeaponInOverall } from '@utils/charts';

type RawData = { [key: string]: any; }

export default class Statistics
{
  public hydrated: boolean = false;

  public miscellaneousStatistics: Record<MiscellaneousStatistics, number> = {
    [MiscellaneousStatistics.AmmoDropped]: 0,
    [MiscellaneousStatistics.CaravanItemsPurchased]: 0,
    [MiscellaneousStatistics.CardsPlayed]: 0,
    [MiscellaneousStatistics.CleanersRescued]: 0,
    [MiscellaneousStatistics.CleanersRevived]: 0,
    [MiscellaneousStatistics.CommonRiddenDamageInflicted]: 0,
    [MiscellaneousStatistics.SpecialRiddenDamageInflicted]: 0,
    [MiscellaneousStatistics.WeakSpotDamageInflicted]: 0,
    [MiscellaneousStatistics.EnemyDamageInflicted]: 0,
    [MiscellaneousStatistics.FriendlyCleanersKilled]: 0,
    [MiscellaneousStatistics.FriendlyDamageInflicted]: 0,
    [MiscellaneousStatistics.HealingAppliedOther]: 0,
    [MiscellaneousStatistics.HealingAppliedSelf]: 0,
    [MiscellaneousStatistics.TimesDiedAsCleaner]: 0,
    [MiscellaneousStatistics.TimesIncappedAsCleaner]: 0,
    [MiscellaneousStatistics.TreasureDoorsOpened]: 0,
    [MiscellaneousStatistics.HordesTriggered]: 0,
    [MiscellaneousStatistics.SnitchersSilenced]: 0,
  };

  public missionsStatistics: Record<ProgressionTypes, MissionsStatistics> = {
    [ProgressionTypes.Merged]: {} as MissionsStatistics,
    [ProgressionTypes.Online]: {} as MissionsStatistics,
    [ProgressionTypes.Offline]: {} as MissionsStatistics,
  };

  public progressions: Record<ProgressionTypes, Progressions> = {
    [ProgressionTypes.Merged]: {},
    [ProgressionTypes.Online]: {},
    [ProgressionTypes.Offline]: {},
  };

  public pvpStatistics: PvpStatistics = {
    gamesLost: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    killsAsCleaner: 0,
    killsAsRidden: 0,
  };

  public riddenKilled: RiddenKilled = {
    riddenCommonKilled: 0,
    riddenKilledTotal: 0,
    riddenMutationsKilled: 0,
    riddenSleeperKilled: 0,
    specials: {
      [Riddens.Ogre]: 0,
      [Riddens.Breaker]: 0,
      [Riddens.Hag]: 0,
      [Riddens.Snitcher]: 0,

      [Riddens.Stinger]: 0,
      [Riddens.Stalker]: 0,
      [Riddens.Hocker]: 0,
      [Riddens.Urchin]: 0,

      [Riddens.Reeker]: 0,
      [Riddens.Retch]: 0,
      [Riddens.Exploder]: 0,
      [Riddens.Shredder]: 0,

      [Riddens.Bruiser]: 0,
      [Riddens.Crusher]: 0,
      [Riddens.Tallboy]: 0,
      [Riddens.Ripper]: 0,
    },
  };

  public weaponsKills: WeaponsKills = {
    [Weapons.Axe]: 0,
    [Weapons.Bat]: 0,
    [Weapons.BobArm]: 0,
    [Weapons.Fist]: 0,
    [Weapons.SkullTotem]: 0,
    [Weapons.Hatchet]: 0,
    [Weapons.Machete]: 0,
    [Weapons.Knife]: 0,
    [Weapons.Tenderizer]: 0,

    [Weapons.M4Carbine]: 0,
    [Weapons.AK47]: 0,
    [Weapons.M16]: 0,
    [Weapons.Scar]: 0,
    [Weapons.RanchRifle]: 0,
    [Weapons.Pestilence]: 0,

    [Weapons.M1911]: 0,
    [Weapons.BerettaM9]: 0,
    [Weapons.BerettaM9Burst]: 0,
    [Weapons.Magnum357]: 0,
    [Weapons.Glock23]: 0,
    [Weapons.Glock23Burst]: 0,
    [Weapons.DesertEagle]: 0,
    [Weapons.Embezzler]: 0,

    [Weapons.Express870]: 0,
    [Weapons.AA12]: 0,
    [Weapons.TheBelgian]: 0,
    [Weapons.TAC14]: 0,
    [Weapons.Super90]: 0,
    [Weapons.Damnation]: 0,

    [Weapons.MP5]: 0,
    [Weapons.UZI]: 0,
    [Weapons.TEC9]: 0,
    [Weapons.UMP45]: 0,
    [Weapons.Vector]: 0,
    [Weapons.Prototype378]: 0,

    [Weapons.M249]: 0,
    [Weapons.RPK]: 0,
    [Weapons.Nemesis]: 0,

    [Weapons.M1A]: 0,
    [Weapons.Phoenix350L]: 0,
    [Weapons.BarrettM95]: 0,
    [Weapons.Witness]: 0,

    [Weapons.None]: 0,
    [Weapons.Unarmed]: 0,
  };

  /**
   * @param rawStatistics
   * @throws Throws error if the object format isn't expected
   */
  public static build(rawStatistics: RawData): Statistics
  {
    // Access main data, if it fails it'll throw error
    const data = rawStatistics.offlineData.stats;

    const miscellaneousStatistics: Record<MiscellaneousStatistics, number> = {
      [MiscellaneousStatistics.AmmoDropped]: _.get(data, 'ammoDropped.base', 0),
      [MiscellaneousStatistics.CaravanItemsPurchased]: _.get(data, 'caravanItemsPurchased.base', 0),
      [MiscellaneousStatistics.CardsPlayed]: _.get(data, 'cardsPlayed.base', 0),
      [MiscellaneousStatistics.CleanersRescued]: _.get(data, 'cleanersRescued.base', 0),
      [MiscellaneousStatistics.CleanersRevived]: _.get(data, 'cleanersRevived.base', 0),
      [MiscellaneousStatistics.CommonRiddenDamageInflicted]: _.get(data, 'commonRiddenDamageInflicted.base', 0),
      [MiscellaneousStatistics.SpecialRiddenDamageInflicted]: _.get(data, 'specialRiddenDamageInflicted.base', 0),
      [MiscellaneousStatistics.WeakSpotDamageInflicted]: _.get(data, 'weakSpotDamageInflicted.base', 0),
      [MiscellaneousStatistics.EnemyDamageInflicted]: _.get(data, 'enemyDamageInflicted.base', 0),
      [MiscellaneousStatistics.FriendlyCleanersKilled]: _.get(data, 'friendlyCleanersKilled.base', 0),
      [MiscellaneousStatistics.FriendlyDamageInflicted]: _.get(data, 'friendlyDamageInflicted.base', 0),
      [MiscellaneousStatistics.HealingAppliedOther]: _.get(data, 'healingApplied.keys.Other', 0),
      [MiscellaneousStatistics.HealingAppliedSelf]: _.get(data, 'healingApplied.keys.Self', 0),
      [MiscellaneousStatistics.TimesDiedAsCleaner]: _.get(data, 'timesDiedAsCleaner.base', 0),
      [MiscellaneousStatistics.TimesIncappedAsCleaner]: _.get(data, 'timesIncappedAsCleaner.base', 0),
      [MiscellaneousStatistics.TreasureDoorsOpened]: _.get(data, 'treasureDoorsOpened.base', 0),
      [MiscellaneousStatistics.HordesTriggered]: _.get(data, 'hordesTriggered.base', 0),
      [MiscellaneousStatistics.SnitchersSilenced]: _.get(data, 'snitchersSilenced.base', 0),
    };

    const missionsStatistics = {
      [ProgressionTypes.Merged]: Statistics.getMissionsStatisticsPerProgressionType(data, ProgressionTypes.Merged),
      [ProgressionTypes.Online]: Statistics.getMissionsStatisticsPerProgressionType(data, ProgressionTypes.Online),
      [ProgressionTypes.Offline]: Statistics.getMissionsStatisticsPerProgressionType(data, ProgressionTypes.Offline),
    };

    const progressions = {
      [ProgressionTypes.Merged]: Statistics.getOverallProgressionPerType(data, ProgressionTypes.Merged),
      [ProgressionTypes.Online]: Statistics.getOverallProgressionPerType(data, ProgressionTypes.Online),
      [ProgressionTypes.Offline]: Statistics.getOverallProgressionPerType(data, ProgressionTypes.Offline),
    };

    const rawRiddenKilled = _.get(data, 'riddenKilledByType.keys', {});

    const riddenKilled: RiddenKilled = {
      specials: {
        [Riddens.Ogre]: _.get(data, 'riddenBossesKilled.base', 0),
        [Riddens.Breaker]: _.get(rawRiddenKilled, 'Breaker', 0),
        [Riddens.Hag]: _.get(rawRiddenKilled, 'Brute', 0),
        [Riddens.Snitcher]: _.get(rawRiddenKilled, 'Snitcher', 0),

        [Riddens.Stinger]: _.get(rawRiddenKilled, 'BunnyKick', 0),
        [Riddens.Stalker]: _.get(rawRiddenKilled, 'Chaser', 0),
        [Riddens.Hocker]: _.get(rawRiddenKilled, 'Chucker', 0),
        [Riddens.Urchin]: _.get(rawRiddenKilled, 'Burner', 0),

        [Riddens.Reeker]: _.get(rawRiddenKilled, 'Bloater', 0),
        [Riddens.Retch]: _.get(rawRiddenKilled, 'Vomiter', 0),
        [Riddens.Exploder]: _.get(rawRiddenKilled, 'Exploder', 0),
        [Riddens.Shredder]: _.get(rawRiddenKilled, 'Imploder', 0),

        [Riddens.Bruiser]: _.get(rawRiddenKilled, 'Smasher', 0),
        [Riddens.Crusher]: _.get(rawRiddenKilled, 'Squeezer', 0),
        [Riddens.Tallboy]: _.get(rawRiddenKilled, 'Tallboy', 0),
        [Riddens.Ripper]: _.get(rawRiddenKilled, 'Heckboy', 0),
      },
      riddenCommonKilled: _.get(data, 'riddenKilledByType.keys.Common', 0),
      riddenSleeperKilled: _.get(data, 'riddenKilledByType.keys.Sleeper', 0),
      riddenKilledTotal: _.get(data, 'riddenKilled.base', 0),
      riddenMutationsKilled: _.get(data, 'riddenMutationsKilled.base', 0),
    };

    const rawWeaponsKills = _.get(data, 'riddenKilledByWeapon.keys', {});

    const weaponsKills: WeaponsKills = {
      [Weapons.Axe]: _.get(rawWeaponsKills, 'Axe', 0),
      [Weapons.Bat]: _.get(rawWeaponsKills, 'Bat', 0),
      [Weapons.BobArm]: _.get(rawWeaponsKills, 'bobarm', 0),
      [Weapons.Fist]: _.get(rawWeaponsKills, 'Fist', 0),
      [Weapons.SkullTotem]: _.get(rawWeaponsKills, 'SkullTotem1', 0) + _.get(rawWeaponsKills, 'SkullTotem2', 0) + _.get(rawWeaponsKills, 'SkullTotem3', 0),
      [Weapons.Hatchet]: _.get(rawWeaponsKills, 'Hatchet', 0),
      [Weapons.Machete]: _.get(rawWeaponsKills, 'Machete', 0),
      [Weapons.Knife]: _.get(rawWeaponsKills, 'Knife', 0),
      [Weapons.Tenderizer]: _.get(rawWeaponsKills, 'FireAxeCorrupted', 0),

      [Weapons.M4Carbine]: _.get(rawWeaponsKills, 'AR01', 0),
      [Weapons.AK47]: _.get(rawWeaponsKills, 'AR02', 0),
      [Weapons.M16]: _.get(rawWeaponsKills, 'AR04', 0),
      [Weapons.Scar]: _.get(rawWeaponsKills, 'AR05', 0),
      [Weapons.RanchRifle]: _.get(rawWeaponsKills, 'AR06', 0),
      [Weapons.Pestilence]: _.get(rawWeaponsKills, 'AR01Corrupted', 0),

      [Weapons.M1911]: _.get(rawWeaponsKills, 'HG01', 0),
      [Weapons.BerettaM9]: _.get(rawWeaponsKills, 'HG02', 0),
      [Weapons.BerettaM9Burst]: _.get(rawWeaponsKills, 'hg02b', 0),
      [Weapons.Magnum357]: _.get(rawWeaponsKills, 'HG03', 0),
      [Weapons.Glock23]: _.get(rawWeaponsKills, 'HG04', 0),
      [Weapons.Glock23Burst]: _.get(rawWeaponsKills, 'hg04b', 0),
      [Weapons.DesertEagle]: _.get(rawWeaponsKills, 'HG05', 0),
      [Weapons.Embezzler]: _.get(rawWeaponsKills, 'HG05Corrupted', 0),

      [Weapons.Express870]: _.get(rawWeaponsKills, 'SG01', 0),
      [Weapons.AA12]: _.get(rawWeaponsKills, 'SG02', 0),
      [Weapons.TheBelgian]: _.get(rawWeaponsKills, 'SG03', 0),
      [Weapons.TAC14]: _.get(rawWeaponsKills, 'SG04', 0),
      [Weapons.Super90]: _.get(rawWeaponsKills, 'SG05', 0),
      [Weapons.Damnation]: _.get(rawWeaponsKills, 'SG02Corrupted', 0),

      [Weapons.MP5]: _.get(rawWeaponsKills, 'SMG01', 0),
      [Weapons.UZI]: _.get(rawWeaponsKills, 'SMG02', 0),
      [Weapons.TEC9]: _.get(rawWeaponsKills, 'SMG03', 0),
      [Weapons.UMP45]: _.get(rawWeaponsKills, 'SMG04', 0),
      [Weapons.Vector]: _.get(rawWeaponsKills, 'SMG05', 0),
      [Weapons.Prototype378]: _.get(rawWeaponsKills, 'SMG04Corrupted', 0),

      [Weapons.M249]: _.get(rawWeaponsKills, 'LMG01', 0),
      [Weapons.RPK]: _.get(rawWeaponsKills, 'LMG02', 0),
      [Weapons.Nemesis]: _.get(rawWeaponsKills, 'LMG02Corrupted', 0),

      [Weapons.M1A]: _.get(rawWeaponsKills, 'AR03', 0),
      [Weapons.Phoenix350L]: _.get(rawWeaponsKills, 'Sni01', 0),
      [Weapons.BarrettM95]: _.get(rawWeaponsKills, 'Sni02', 0),
      [Weapons.Witness]: _.get(rawWeaponsKills, 'AR03Corrupted', 0),

      [Weapons.None]: _.get(rawWeaponsKills, 'None', 0),
      [Weapons.Unarmed]: _.get(rawWeaponsKills, 'Unarmed', 0),
    };

    const pvpStatistics: PvpStatistics = {
      gamesPlayed: _.get(data, 'pVPGamesPlayed.base', 0),
      gamesWon: _.get(data, 'pVPGamesWon.base', 0),
      gamesLost: _.get(data, 'pVPGamesPlayed.base', 0) - _.get(data, 'pVPGamesWon.base', 0),
      killsAsCleaner: _.get(data, 'pVPKillsAsCleaners.base', 0),
      killsAsRidden: _.get(data, 'pVPKillsAsRidden.base', 0),
    };

    const statistics = new Statistics();

    statistics.miscellaneousStatistics = miscellaneousStatistics;
    statistics.missionsStatistics = missionsStatistics;
    statistics.progressions = progressions;
    statistics.riddenKilled = riddenKilled;
    statistics.weaponsKills = weaponsKills;
    statistics.pvpStatistics = pvpStatistics;
    statistics.hydrated = true;

    return statistics;
  }

  public static getWeaponsFromWeaponType(type: WeaponTypes | string): Weapons[]
  {
    return WeaponsSorted[type as WeaponTypes];
  }

  public static getKillCountByWeaponType(stats: Statistics, type: WeaponTypes): number
  {
    const weapons = Statistics.getWeaponsFromWeaponType(type);
    let total = 0;

    for (const weapon of weapons) {
      if (isSkippableWeaponInOverall(weapon)) {
        continue;
      }

      total += stats.weaponsKills[weapon];
    }

    return total;
  }

  public getAverageValuePerMissionCompleted(value: number, fixed: boolean = true, fixedDecimal: number = 2): string | number
  {
    // We'll set the average for the overall missions done
    const average = value / this.missionsStatistics[ProgressionTypes.Merged].missionsCompleted;

    if (fixed) {
      return average.toFixed(fixedDecimal);
    }

    return Math.round(average);
  }

  public getAverageValuePerPvpMissionCompleted(value: number, fixed: boolean = true, fixedDecimal: number = 2): string | number
  {
    const average = value / this.pvpStatistics.gamesPlayed;

    if (fixed) {
      return average.toFixed(fixedDecimal);
    }

    return Math.round(average);
  }

  private static getMissionsPerProgressionType(data: RawData, progressionType: ProgressionTypes): RawData
  {
    const onlineMissions = _.get(data, 'missionsCompleted_Secured', {});
    const offlineMissions = _.get(data, 'missionsCompleted_Unsecured', {});
    const mergedMissions = Statistics.mergeMissionData(onlineMissions, offlineMissions);

    switch (progressionType) {
      case ProgressionTypes.Online:
        return onlineMissions;
      case ProgressionTypes.Offline:
        return offlineMissions;
      case ProgressionTypes.Merged:
        return mergedMissions;
    }
  }

  private static getMissionsStatisticsPerProgressionType(data: RawData, progressionType: ProgressionTypes): MissionsStatistics
  {
    const missions = Statistics.getMissionsPerProgressionType(data, progressionType);

    return {
      missionsCompleted: _.get(missions, 'base', 0),
      missionsCompletedPerDifficulty: Statistics.getMissionsCompletedPerDifficulty(_.get(missions, 'keys', {})),
      missionsCompletedPerCleaner: {
        [Cleaners.Evangelo]: Statistics.getMissionsCompletedPerCleaner(missions.keys, 'Hero_1'),
        [Cleaners.Walker]: Statistics.getMissionsCompletedPerCleaner(missions.keys, 'Hero_2'),
        [Cleaners.Holly]: Statistics.getMissionsCompletedPerCleaner(missions.keys, 'Hero_3'),
        [Cleaners.Hoffman]: Statistics.getMissionsCompletedPerCleaner(missions.keys, 'Hero_4'),
        [Cleaners.Doc]: Statistics.getMissionsCompletedPerCleaner(missions.keys, 'Hero_5'),
        [Cleaners.Jim]: Statistics.getMissionsCompletedPerCleaner(missions.keys, 'Hero_6'),
        [Cleaners.Karlee]: Statistics.getMissionsCompletedPerCleaner(missions.keys, 'Hero_7'),
        [Cleaners.Mom]: Statistics.getMissionsCompletedPerCleaner(missions.keys, 'Hero_8'),
        [Cleaners.Heng]: Statistics.getMissionsCompletedPerCleaner(missions.keys, 'Hero_9'),
        [Cleaners.Sharice]: Statistics.getMissionsCompletedPerCleaner(missions.keys, 'Hero_10'),
      },
      missionsCompletedRaw: _.get(missions, 'keys', {}),
    };
  }

  private static getOverallProgressionPerType(data: RawData, progressionType: ProgressionTypes): Progressions
  {
    const missions = Statistics.getMissionsPerProgressionType(data, progressionType);

    return Statistics.getProgressionsByCleaners(_.get(missions, 'keys', {}));
  }

  /**
   * Merge online and offline mission data
   */
  private static mergeMissionData(onlineMissions: any, offlineMissions: any): RawData
  {
    const mergedMissions = {
      'base': 0,
      'keys': {},
    };

    mergedMissions['base'] = _.get(onlineMissions, 'base', 0) + _.get(offlineMissions, 'base', 0);
    mergedMissions['keys'] = _.mergeWith(
      {},
      _.get(onlineMissions, 'keys', {}),
      _.get(offlineMissions, 'keys', {}),
      (obj: number, src: number): number => {
        return _.defaultTo(obj, 0) + _.defaultTo(src, 0);
      },
    );

    return mergedMissions;
  }

  /**
   * Get raw values of how many missions were completed in each difficulty
   */
  private static getMissionsCompletedPerDifficulty(rawMissions: { [index: string]: number }): MissionsCompletedPerDifficulty
  {
    let missionsCompleteByDifficulties: MissionsCompletedPerDifficulty = {
      [Difficulties.Recruit]: 0,
      [Difficulties.Veteran]: 0,
      [Difficulties.Nightmare]: 0,
      [Difficulties.NoHope]: 0,
      [Difficulties.Swarm]: 0,
    };

    Object.keys(rawMissions).forEach((mission: string) => {
      const value: number = rawMissions[mission];

      // We don't want to count individual hero missions
      if (mission.includes('hero')) {
        return;
      }

      if (mission.includes('easy')) {
        missionsCompleteByDifficulties[Difficulties.Recruit] += value;
      } else if (mission.includes('normal')) {
        missionsCompleteByDifficulties[Difficulties.Veteran] += value;
      } else if (mission.includes('veryhard')) {
        missionsCompleteByDifficulties[Difficulties.NoHope] += value;
      } else if (mission.includes('hard')) {
        missionsCompleteByDifficulties[Difficulties.Nightmare] += value;
      } else if (mission.includes('pvp')) {
        missionsCompleteByDifficulties[Difficulties.Swarm] += value;
      }
    });

    return missionsCompleteByDifficulties;
  }

  private static getMissionsCompletedPerCleaner(rawMissions: RawData, cleaner: string): MissionsCompletedPerCleaner
  {
    let missionsCompleteByCleaner: MissionsCompletedPerCleaner = {
      total: _.get(rawMissions, cleaner, 0),
      [Difficulties.Recruit]: 0,
      [Difficulties.Veteran]: 0,
      [Difficulties.Nightmare]: 0,
      [Difficulties.NoHope]: 0,
      [Difficulties.Swarm]: 0,
    };

    // In case the player didn't play offline / online at all, we abort to prevent conversion error
    if (!rawMissions) {
      return missionsCompleteByCleaner;
    }

    Object.keys(rawMissions).forEach((mission: string) => {
      const value: number = rawMissions[mission];

      // We skip values that don't concern cleaner passed

      // Handle special case for Evangelo (Hero_1) and Sharice (Hero_10) overlapping includes condition
      if (cleaner === 'Hero_1' && mission.includes('hero_10')) {
        return;
      }

      if (!mission.includes(cleaner.toLowerCase())) {
        return;
      }

      if (mission.includes('easy')) {
        missionsCompleteByCleaner[Difficulties.Recruit] += value;
      } else if (mission.includes('normal')) {
        missionsCompleteByCleaner[Difficulties.Veteran] += value;
      } else if (mission.includes('veryhard')) {
        missionsCompleteByCleaner[Difficulties.NoHope] += value;
      } else if (mission.includes('hard')) {
        missionsCompleteByCleaner[Difficulties.Nightmare] += value;
      } else if (mission.includes('pvp')) {
        missionsCompleteByCleaner[Difficulties.Swarm] += value;
      }
    });

    return missionsCompleteByCleaner;
  }

  /**
   * Convert raw progression to formatted one
   */
  private static getProgressionsByCleaners(rawProgression: object): Progressions
  {
    const progressions: Progressions = {};

    Object.values(Cleaners).forEach((cleaner: string) => {
      progressions[cleaner] = {};

      Object.values(Difficulties).forEach((difficulty: string) => {
        progressions[cleaner][difficulty] = {};

        Object.values(Missions).forEach((mission: string) => {
          const key = `${mission}::${difficulty}::${cleaner}`;

          progressions[cleaner][difficulty][mission] = (key in rawProgression);
        });
      });
    });

    return progressions;
  }
}