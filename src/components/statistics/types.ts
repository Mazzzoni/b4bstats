export enum ProgressionTypes
{
  Online = 'online',
  Offline = 'offline',
  Merged = 'merged',
}

export enum Missions
{
  // Act 1
  Resurgence = 'evans_a',
  TunnelOfBlood = 'evans_b',
  PainTrain = 'evans_c',
  TheCrossing = 'evans_d',

  ACleanSweep = 'finley_rescue_a',
  BookWorms = 'finley_rescue_b',
  BarRoomBlitz = 'finley_rescue_c',

  SpecialDelivery = 'finley_diner_a',
  TheDiner = 'finley_diner_b',

  BadSeeds = 'bluedog_a',
  HellsBells = 'bluedog_b',
  Abandoned = 'bluedog_c',
  TheSoundOfThunder = 'bluedog_d',

  // Act 2
  ACallToArms = 'finley_police_a',
  TheHandyMan = 'finley_police_b',

  PipeCleaners = 'clog_a',
  Hinterland = 'clog_b',
  TrailerTrashed = 'clog_c',
  TheClog = 'clog_d',
  TheBrokenBird = 'clog_e',

  HeraldsOfTheWormPart1 = 'finley_church_a',
  HeraldsOfTheWormPart2 = 'finley_church_b',
  GraveDanger = 'finley_church_c',

  // Act 3
  FartherAfield = 'manor_a',
  BlazingTrails = 'manor_b',
  CabinsByTheLake = 'manor_c',
  GardenParty = 'manor_d',
  T5 = 'manor_e',

  AFriendInNeed = 'cdc_a',
  MakingTheGrade = 'cdc_b',
  TheRoadToHell = 'cdc_c',
  TheBodyDump = 'cdc_d',

  // Act 4
  TheAbomination = 'titan_a',

  // Hives
  CausticCesspool = 'dungeon_trench',
  BloodStream = 'dungeon_river',
  TheCut = 'dungeon_chasm',
  SunkenPassage = 'dungeon_chamber',
  TheNursery = 'dungeon_arena',
  BroodLair = 'dungeon_infestation',
  Below300 = 'dungeon_mines',
}

export const SwarmMissions: Missions[] = [
  Missions.Resurgence,
  Missions.TunnelOfBlood,
  Missions.PainTrain,

  Missions.BadSeeds,
  Missions.HellsBells,
  Missions.Abandoned,

  Missions.PipeCleaners,
  Missions.Hinterland,
  Missions.TrailerTrashed,

  Missions.HeraldsOfTheWormPart1,
  Missions.HeraldsOfTheWormPart2,
  Missions.GraveDanger,

  Missions.FartherAfield,
  Missions.BlazingTrails,
  Missions.CabinsByTheLake,

  Missions.AFriendInNeed,
  Missions.MakingTheGrade,
  Missions.TheRoadToHell,
];

export enum MiscellaneousStatistics
{
  AmmoDropped,
  CaravanItemsPurchased,
  CardsPlayed,
  CleanersRescued,
  CleanersRevived,
  CommonRiddenDamageInflicted,
  SpecialRiddenDamageInflicted,
  WeakSpotDamageInflicted,
  EnemyDamageInflicted,
  FriendlyCleanersKilled,
  FriendlyDamageInflicted,
  HealingAppliedOther,
  HealingAppliedSelf,
  TimesDiedAsCleaner,
  TimesIncappedAsCleaner,
  TreasureDoorsOpened,
  HordesTriggered,
  SnitchersSilenced,
}

export enum BurnCards
{
  AmmoDrop = 'Burn_AmmoRestoreMaxTeam_25',
  DustyCustomAssaultRifle = 'Burn_RollGunAR',
  DustyCustomHandgun = 'Burn_RollGunHG',
  DustyCustomShotgun = 'Burn_RollGunSG',
  DustyCustomSMG = 'Burn_RollGunSMG',
  DustyCustomLMG = 'Burn_RollGunLMG',
  DustyCustomSniper = 'Burn_RollGunSNI',
  ExtraPadding = 'Burn_TraumaResistTeam_25',
  HazardSuit = 'Burn_ElementalResistTeam_25',
  HellCanWait = 'Burn_ExtraContinue_1',
  HiredGun = 'Burn_HiredGun_5',
  SlipperyWhenWet = 'Burn_BreakoutTeam',
  UrgentCare = 'Burn_TraumaRecoverTeam_25',
  Windfall = 'Burn_TeamCurrency_250',

  // Not used released at the moment
  DefenseUpgrade = 'DefenseUpgrade',
  GroupHug = 'GroupHug',
  AttachmentScavenger = 'AttachmentScavenger',
  MedicalSupplyScavenger = 'MedicalSupplyScavenger',
  OffensiveSupplyScavenger = 'OffensiveSupplyScavenger',
  SquadArmor = 'SquadArmor',
}

export enum Cleaners
{
  Evangelo = 'hero_1',
  Walker = 'hero_2',
  Holly = 'hero_3',
  Hoffman = 'hero_4',
  Doc = 'hero_5',
  Jim = 'hero_6',
  Karlee = 'hero_7',
  Mom = 'hero_8',
  Heng = 'hero_9',
  Sharice = 'hero_10',
}

export enum Difficulties
{
  Recruit = 'easy',
  Veteran = 'normal',
  Nightmare = 'hard',
  NoHope = 'veryhard',
  Swarm = 'pvp',
}

export enum Riddens
{
  Ogre,
  Breaker,
  Hag,
  Snitcher,

  Stinger,
  Stalker,
  Hocker,
  Urchin,

  Reeker,
  Retch,
  Exploder,
  Shredder,

  Bruiser,
  Crusher,
  Tallboy,
  Ripper,
}

export enum WeaponTypes
{
  Melee = 'Melee',
  AssaultRifle = 'AssaultRifle',
  Handgun = 'Handgun',
  Shotgun = 'Shotgun',
  SMG = 'SMG',
  LMG = 'LMG',
  Sniper = 'Sniper',
}

export enum Weapons
{
  Axe,
  Bat,
  BobArm,
  Fist,
  SkullTotem,
  Hatchet,
  Machete,
  Knife,
  Tenderizer,

  M4Carbine,
  AK47,
  M16,
  Scar,
  RanchRifle,
  Pestilence,

  M1911,
  BerettaM9,
  BerettaM9Burst,
  Magnum357,
  Glock23,
  Glock23Burst,
  DesertEagle,
  Embezzler,

  Express870,
  AA12,
  TheBelgian,
  TAC14,
  Super90,
  Damnation,

  MP5,
  UZI,
  TEC9,
  UMP45,
  Vector,
  Prototype378,

  M249,
  RPK,
  Nemesis,

  M1A,
  Phoenix350L,
  BarrettM95,
  Witness,

  // I don't know what these correspond to (explosions ?)
  None,
  Unarmed,
}

export const WeaponsMelee: Weapons[] = [
  Weapons.Axe,
  Weapons.Bat,
  Weapons.BobArm,
  Weapons.Fist,
  Weapons.SkullTotem,
  Weapons.Hatchet,
  Weapons.Machete,
  Weapons.Knife,
  Weapons.Tenderizer,
];

export const WeaponsAssaultRifle: Weapons[] = [
  Weapons.M4Carbine,
  Weapons.AK47,
  Weapons.M16,
  Weapons.Scar,
  Weapons.RanchRifle,
  Weapons.Pestilence,
];

export const WeaponsHandgun: Weapons[] = [
  Weapons.M1911,
  Weapons.BerettaM9,
  Weapons.BerettaM9Burst,
  Weapons.Magnum357,
  Weapons.Glock23,
  Weapons.Glock23Burst,
  Weapons.DesertEagle,
  Weapons.Embezzler,
];

export const WeaponsShotgun: Weapons[] = [
  Weapons.Express870,
  Weapons.AA12,
  Weapons.TheBelgian,
  Weapons.TAC14,
  Weapons.Super90,
  Weapons.Damnation,
];

export const WeaponsSMG: Weapons[] = [
  Weapons.MP5,
  Weapons.UZI,
  Weapons.TEC9,
  Weapons.UMP45,
  Weapons.Vector,
  Weapons.Prototype378,
];

export const WeaponsLMG: Weapons[] = [
  Weapons.M249,
  Weapons.RPK,
  Weapons.Nemesis,
];

export const WeaponsSniper: Weapons[] = [
  Weapons.M1A,
  Weapons.Phoenix350L,
  Weapons.BarrettM95,
  Weapons.Witness,
];

export const WeaponsSorted: Record<WeaponTypes, Weapons[]> = {
  [WeaponTypes.Melee]: WeaponsMelee,
  [WeaponTypes.AssaultRifle]: WeaponsAssaultRifle,
  [WeaponTypes.Handgun]: WeaponsHandgun,
  [WeaponTypes.Shotgun]: WeaponsShotgun,
  [WeaponTypes.SMG]: WeaponsSMG,
  [WeaponTypes.LMG]: WeaponsLMG,
  [WeaponTypes.Sniper]: WeaponsSniper,
};

export type MissionsCompletedPerCleaner = {
  total: number
  [Difficulties.Recruit]: number
  [Difficulties.Veteran]: number
  [Difficulties.Nightmare]: number
  [Difficulties.NoHope]: number
  [Difficulties.Swarm]: number
}

export type MissionsCompletedPerDifficulty = {
  [Difficulties.Recruit]: number
  [Difficulties.Veteran]: number
  [Difficulties.Nightmare]: number
  [Difficulties.NoHope]: number
  [Difficulties.Swarm]: number
}

export type MissionsStatistics = {
  missionsCompleted: number
  missionsCompletedPerDifficulty: MissionsCompletedPerDifficulty
  missionsCompletedPerCleaner: Record<Cleaners, MissionsCompletedPerCleaner>
  // Contain missions completed in raw form (to link how many times a mission have been completed)
  missionsCompletedRaw: { [index: string]: number }
}

export type Progressions = {
  [cleanerId: string]: {
    [difficultyId: string]: {
      [missionId: string]: boolean
    }
  }
}

export type RiddenKilled = {
  riddenCommonKilled: number
  riddenMutationsKilled: number
  riddenSleeperKilled: number
  riddenKilledTotal: number
  specials: Record<Riddens, number>
}

export type WeaponsKills = Record<Weapons, number>

export type PvpStatistics = {
  gamesPlayed: number
  gamesWon: number
  gamesLost: number
  killsAsCleaner: number
  killsAsRidden: number
}