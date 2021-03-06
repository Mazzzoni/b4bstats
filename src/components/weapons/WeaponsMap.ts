import { Weapons } from '@components/statistics/types';
import { WeaponCategories, WeaponDefinition, WeaponQualities } from '@components/weapons/types';

type WeaponMapDefinition = Partial<Omit<WeaponDefinition, 'name' | 'qualities'>> & {
  name: Weapons;
  qualities: Partial<Record<WeaponQualities, number>>;
};

type WeaponsMapDefinition = {
  [key in 'Ranged' | 'Melee']: WeaponMapDefinition[];
};

// All weapons that fire in bursts, shot 3 times (Beretta M9 / M16)
export const burstCount = 3;

// Map each weapon to their matching line (per quality) from data document
export const WeaponsMap: WeaponsMapDefinition = {
  Ranged: [
    // AR
    {
      name: Weapons.M4Carbine,
      category: WeaponCategories.AssaultRifle,
      image: 'm4.webp',
      slot: 'primary',
      ammo: 'rifle',
      attachments: {
        barrel: true,
        magazine: true,
        scope: true,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 6,
        [WeaponQualities.Uncommon]: 7,
        [WeaponQualities.Rare]: 8,
        [WeaponQualities.Epic]: 9,
      },
    },
    {
      name: Weapons.AK47,
      category: WeaponCategories.AssaultRifle,
      image: 'ak47.webp',
      slot: 'primary',
      ammo: 'rifle',
      attachments: {
        barrel: true,
        magazine: true,
        scope: true,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 12,
        [WeaponQualities.Uncommon]: 13,
        [WeaponQualities.Rare]: 14,
        [WeaponQualities.Epic]: 15,
      },
    },
    {
      name: Weapons.M16,
      category: WeaponCategories.AssaultRifle,
      image: 'm16.webp',
      slot: 'primary',
      ammo: 'rifle',
      attachments: {
        barrel: true,
        magazine: true,
        scope: true,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 17,
        [WeaponQualities.Uncommon]: 18,
        [WeaponQualities.Rare]: 19,
        [WeaponQualities.Epic]: 20,
      },
    },
    {
      name: Weapons.Scar,
      category: WeaponCategories.AssaultRifle,
      image: 'scar.webp',
      slot: 'primary',
      ammo: 'rifle',
      attachments: {
        barrel: true,
        magazine: true,
        scope: true,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 22,
        [WeaponQualities.Uncommon]: 23,
        [WeaponQualities.Rare]: 24,
        [WeaponQualities.Epic]: 25,
      },
    },
    {
      name: Weapons.RanchRifle,
      category: WeaponCategories.AssaultRifle,
      image: 'ranch_rifle.webp',
      slot: 'primary',
      ammo: 'rifle',
      attachments: {
        barrel: true,
        magazine: true,
        scope: true,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 147,
        [WeaponQualities.Uncommon]: 148,
        [WeaponQualities.Rare]: 149,
        [WeaponQualities.Epic]: 150,
      },
      notes: {
        'Weakspot Multiplier Bonus': 'x1.1 weakspot multiplier bonus.',
      },
    },
    {
      name: Weapons.Pestilence,
      category: WeaponCategories.AssaultRifle,
      image: 'pestilence.webp',
      slot: 'primary',
      ammo: 'rifle',
      attachments: {
        barrel: false,
        magazine: false,
        scope: false,
        stock: false,
      },
      qualities: {
        [WeaponQualities.Legendary]: 10,
      },
      notes: {
        'Atrophy': 'Successful hits with this weapon apply a stacking 3 damage per second and reduces the damage the target deals by 1%.',
      },
    },

    // Handgun
    {
      name: Weapons.M1911,
      category: WeaponCategories.Handgun,
      image: 'm1911.webp',
      slot: 'secondary',
      ammo: 'pistol_smg',
      attachments: {
        barrel: true,
        magazine: true,
        scope: false,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 28,
        [WeaponQualities.Uncommon]: 29,
        [WeaponQualities.Rare]: 30,
        [WeaponQualities.Epic]: 31,
      },
    },
    {
      name: Weapons.BerettaM9,
      category: WeaponCategories.Handgun,
      image: 'beretta_m9.webp',
      slot: 'secondary',
      ammo: 'pistol_smg',
      attachments: {
        barrel: true,
        magazine: true,
        scope: false,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 33,
        [WeaponQualities.Uncommon]: 34,
        [WeaponQualities.Rare]: 35,
        [WeaponQualities.Epic]: 36,
      },
      notes: {
        'Weakspot Multiplier Bonus': 'x1.1 weakspot multiplier bonus.',
      },
    },
    {
      name: Weapons.BerettaM9Burst,
      category: WeaponCategories.Handgun,
      image: 'beretta_m9.webp',
      slot: 'secondary',
      ammo: 'pistol_smg',
      attachments: {
        barrel: true,
        magazine: true,
        scope: false,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 38,
        [WeaponQualities.Uncommon]: 39,
        [WeaponQualities.Rare]: 40,
        [WeaponQualities.Epic]: 41,
      },
      notes: {
        'Weakspot Multiplier Bonus': 'x1.1 weakspot multiplier bonus.',
      },
    },
    {
      name: Weapons.Magnum357,
      category: WeaponCategories.Handgun,
      image: '357_magnum.webp',
      slot: 'secondary',
      ammo: 'rifle',
      attachments: {
        barrel: true,
        magazine: true,
        scope: true,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 43,
        [WeaponQualities.Uncommon]: 44,
        [WeaponQualities.Rare]: 45,
        [WeaponQualities.Epic]: 46,
      },
    },
    {
      name: Weapons.Glock23,
      category: WeaponCategories.Handgun,
      image: 'glock_23.webp',
      slot: 'secondary',
      ammo: 'pistol_smg',
      attachments: {
        barrel: true,
        magazine: true,
        scope: false,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 48,
        [WeaponQualities.Uncommon]: 49,
        [WeaponQualities.Rare]: 50,
        [WeaponQualities.Epic]: 51,
      },
    },
    {
      name: Weapons.Glock23Burst,
      category: WeaponCategories.Handgun,
      image: 'glock_23.webp',
      slot: 'secondary',
      ammo: 'pistol_smg',
      attachments: {
        barrel: true,
        magazine: true,
        scope: false,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 53,
        [WeaponQualities.Uncommon]: 54,
        [WeaponQualities.Rare]: 55,
        [WeaponQualities.Epic]: 56,
      },
    },
    {
      name: Weapons.DesertEagle,
      category: WeaponCategories.Handgun,
      image: 'desert_eagle.webp',
      slot: 'secondary',
      ammo: 'sniper',
      attachments: {
        barrel: true,
        magazine: true,
        scope: true,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 58,
        [WeaponQualities.Uncommon]: 59,
        [WeaponQualities.Rare]: 60,
        [WeaponQualities.Epic]: 61,
      },
    },
    {
      name: Weapons.Embezzler,
      category: WeaponCategories.Handgun,
      image: 'embezzler.webp',
      slot: 'secondary',
      ammo: 'rifle',
      attachments: {
        barrel: false,
        magazine: false,
        scope: false,
        stock: false,
      },
      qualities: {
        [WeaponQualities.Legendary]: 62,
      },
      notes: {
        'Death and Taxes': 'Killing blows generate up to 10 Copper per kill.',
      },
    },

    // LMG
    {
      name: Weapons.M249,
      category: WeaponCategories.LMG,
      image: 'm249.webp',
      slot: 'primary',
      ammo: 'rifle',
      attachments: {
        barrel: true,
        magazine: true,
        scope: true,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 65,
        [WeaponQualities.Uncommon]: 66,
        [WeaponQualities.Rare]: 67,
        [WeaponQualities.Epic]: 68,
      },
    },
    {
      name: Weapons.RPK,
      category: WeaponCategories.LMG,
      image: 'rpk.webp',
      slot: 'primary',
      ammo: 'rifle',
      attachments: {
        barrel: true,
        magazine: true,
        scope: true,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 70,
        [WeaponQualities.Uncommon]: 71,
        [WeaponQualities.Rare]: 72,
        [WeaponQualities.Epic]: 73,
      },
    },
    {
      name: Weapons.Nemesis,
      category: WeaponCategories.LMG,
      image: 'rpk.webp',
      slot: 'primary',
      ammo: 'rifle',
      attachments: {
        barrel: false,
        magazine: false,
        scope: false,
        stock: false,
      },
      qualities: {
        [WeaponQualities.Legendary]: 74,
      },
      notes: {
        'Final Showdown': 'Enemies within 30 meters are drawn to the wielder of this weapon.',
      },
    },

    // Shotgun
    {
      name: Weapons.Express870,
      category: WeaponCategories.Shotgun,
      image: '870_express.webp',
      slot: 'primary',
      ammo: 'shotgun',
      attachments: {
        barrel: true,
        magazine: true,
        scope: true,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 77,
        [WeaponQualities.Uncommon]: 78,
        [WeaponQualities.Rare]: 79,
        [WeaponQualities.Epic]: 80,
      },
    },
    {
      name: Weapons.AA12,
      category: WeaponCategories.Shotgun,
      image: 'aa12.webp',
      slot: 'primary',
      ammo: 'shotgun',
      attachments: {
        barrel: true,
        magazine: true,
        scope: true,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 82,
        [WeaponQualities.Uncommon]: 83,
        [WeaponQualities.Rare]: 84,
        [WeaponQualities.Epic]: 85,
      },
    },
    {
      name: Weapons.TheBelgian,
      category: WeaponCategories.Shotgun,
      image: 'the_belgian.webp',
      slot: 'secondary',
      ammo: 'shotgun',
      attachments: {
        barrel: false,
        magazine: false,
        scope: false,
        stock: false,
      },
      qualities: {
        [WeaponQualities.Common]: 88,
        [WeaponQualities.Uncommon]: 89,
        [WeaponQualities.Rare]: 90,
        [WeaponQualities.Epic]: 91,
      },
    },
    {
      name: Weapons.TAC14,
      category: WeaponCategories.Shotgun,
      image: 'tac14.webp',
      slot: 'primary',
      ammo: 'shotgun',
      attachments: {
        barrel: true,
        magazine: true,
        scope: true,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 93,
        [WeaponQualities.Uncommon]: 94,
        [WeaponQualities.Rare]: 95,
        [WeaponQualities.Epic]: 96,
      },
    },
    {
      name: Weapons.Super90,
      category: WeaponCategories.Shotgun,
      image: 'super90.webp',
      slot: 'primary',
      ammo: 'shotgun',
      attachments: {
        barrel: true,
        magazine: true,
        scope: true,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 98,
        [WeaponQualities.Uncommon]: 99,
        [WeaponQualities.Rare]: 100,
        [WeaponQualities.Epic]: 101,
      },
    },
    {
      name: Weapons.Damnation,
      category: WeaponCategories.Shotgun,
      image: 'aa12.webp',
      slot: 'primary',
      ammo: 'shotgun',
      attachments: {
        barrel: false,
        magazine: false,
        scope: false,
        stock: false,
      },
      qualities: {
        [WeaponQualities.Legendary]: 86,
      },
      notes: {
        'Fire and Brimstone': 'Incendiary rounds burn targets for 50 damage per second for 3 seconds. Damnation\'s wielder is immune to Fire Damage.',
      },
    },

    // SMG
    {
      name: Weapons.MP5,
      category: WeaponCategories.SMG,
      image: 'mp5.webp',
      slot: 'primary',
      ammo: 'pistol_smg',
      attachments: {
        barrel: true,
        magazine: true,
        scope: true,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 104,
        [WeaponQualities.Uncommon]: 105,
        [WeaponQualities.Rare]: 106,
        [WeaponQualities.Epic]: 107,
      },
    },
    {
      name: Weapons.UZI,
      category: WeaponCategories.SMG,
      image: 'uzi.webp',
      slot: 'primary',
      ammo: 'pistol_smg',
      attachments: {
        barrel: true,
        magazine: true,
        scope: true,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 109,
        [WeaponQualities.Uncommon]: 110,
        [WeaponQualities.Rare]: 111,
        [WeaponQualities.Epic]: 112,
      },
    },
    {
      name: Weapons.TEC9,
      category: WeaponCategories.SMG,
      image: 'tec9.webp',
      slot: 'secondary',
      ammo: 'pistol_smg',
      attachments: {
        barrel: true,
        magazine: true,
        scope: false,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 114,
        [WeaponQualities.Uncommon]: 115,
        [WeaponQualities.Rare]: 116,
        [WeaponQualities.Epic]: 117,
      },
    },
    {
      name: Weapons.UMP45,
      category: WeaponCategories.SMG,
      image: 'ump45.webp',
      slot: 'primary',
      ammo: 'pistol_smg',
      attachments: {
        barrel: true,
        magazine: true,
        scope: true,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 119,
        [WeaponQualities.Uncommon]: 120,
        [WeaponQualities.Rare]: 121,
        [WeaponQualities.Epic]: 122,
      },
    },
    {
      name: Weapons.Vector,
      category: WeaponCategories.SMG,
      image: 'vector.webp',
      slot: 'primary',
      ammo: 'pistol_smg',
      attachments: {
        barrel: true,
        magazine: true,
        scope: true,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 125,
        [WeaponQualities.Uncommon]: 126,
        [WeaponQualities.Rare]: 127,
        [WeaponQualities.Epic]: 128,
      },
    },
    {
      name: Weapons.Prototype378,
      category: WeaponCategories.SMG,
      image: 'ump45.webp',
      slot: 'primary',
      ammo: 'pistol_smg',
      attachments: {
        barrel: false,
        magazine: false,
        scope: false,
        stock: false,
      },
      qualities: {
        [WeaponQualities.Legendary]: 123,
      },
      notes: {
        'ZAP!': 'Significantly slows targets for 1 seconds.',
      },
    },

    // Snipers
    {
      name: Weapons.M1A,
      category: WeaponCategories.Sniper,
      image: 'm1a.webp',
      slot: 'primary',
      ammo: 'sniper',
      attachments: {
        barrel: true,
        magazine: true,
        scope: true,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 141,
        [WeaponQualities.Uncommon]: 142,
        [WeaponQualities.Rare]: 143,
        [WeaponQualities.Epic]: 144,
      },
    },
    {
      name: Weapons.Phoenix350L,
      category: WeaponCategories.Sniper,
      image: 'phoenix_350l.webp',
      slot: 'primary',
      ammo: 'sniper',
      attachments: {
        barrel: true,
        magazine: true,
        scope: true,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 131,
        [WeaponQualities.Uncommon]: 132,
        [WeaponQualities.Rare]: 133,
        [WeaponQualities.Epic]: 134,
      },
    },
    {
      name: Weapons.BarrettM95,
      category: WeaponCategories.Sniper,
      image: 'barrett_m95.webp',
      slot: 'primary',
      ammo: 'sniper',
      attachments: {
        barrel: true,
        magazine: true,
        scope: true,
        stock: true,
      },
      qualities: {
        [WeaponQualities.Common]: 136,
        [WeaponQualities.Uncommon]: 137,
        [WeaponQualities.Rare]: 138,
        [WeaponQualities.Epic]: 139,
      },
    },
    {
      name: Weapons.Witness,
      category: WeaponCategories.Sniper,
      image: 'witness.webp',
      slot: 'primary',
      ammo: 'sniper',
      attachments: {
        barrel: false,
        magazine: false,
        scope: false,
        stock: false,
      },
      qualities: {
        [WeaponQualities.Legendary]: 145,
      },
      notes: {
        'Sight Unseen': 'Highlights targets and increases damage dealt to them by 20%.',
        'Attachments': 'Always have a 4x scope (does not increase weakspot damage) and suppressor (does not increase damage to unaware enemies) equipped.',
      },
    },
  ],

  Melee: [
    {
      name: Weapons.Bat,
      category: WeaponCategories.Melee,
      image: 'bat.webp',
      slot: 'secondary',
      qualities: {
        [WeaponQualities.Common]: 5,
        [WeaponQualities.Uncommon]: 6,
        [WeaponQualities.Rare]: 7,
        [WeaponQualities.Epic]: 8,
      },
    },
    {
      name: Weapons.Axe,
      category: WeaponCategories.Melee,
      image: 'fire_axe.webp',
      slot: 'secondary',
      qualities: {
        [WeaponQualities.Common]: 9,
        [WeaponQualities.Uncommon]: 10,
        [WeaponQualities.Rare]: 11,
        [WeaponQualities.Epic]: 12,
      },
    },
    {
      name: Weapons.Hatchet,
      category: WeaponCategories.Melee,
      image: 'hatchet.webp',
      slot: 'secondary',
      qualities: {
        [WeaponQualities.Common]: 14,
        [WeaponQualities.Uncommon]: 15,
        [WeaponQualities.Rare]: 16,
        [WeaponQualities.Epic]: 17,
      },
    },
    {
      name: Weapons.Machete,
      category: WeaponCategories.Melee,
      image: 'machete.webp',
      slot: 'secondary',
      qualities: {
        [WeaponQualities.Common]: 18,
        [WeaponQualities.Uncommon]: 19,
        [WeaponQualities.Rare]: 20,
        [WeaponQualities.Epic]: 21,
      },
    },
    {
      name: Weapons.Tenderizer,
      category: WeaponCategories.Melee,
      image: 'tenderizer.webp',
      slot: 'secondary',
      qualities: {
        [WeaponQualities.Legendary]: 13,
      },
      notes: {
        'Mincemeat': 'Dismembers enemies upon impact, and deals 90 damage in a large area of effect.',
      },
    },
    {
      name: Weapons.SkullTotem,
      category: WeaponCategories.Melee,
      image: 'skull_totem.webp',
      slot: 'n/a',
      qualities: {
        [WeaponQualities.Rare]: 26,
        [WeaponQualities.Epic]: 27,
        [WeaponQualities.Legendary]: 28,
      },
      notes: {
        'Inversed quality': 'Statistics worsen when you increase quality. (not applicable for damage and stumble)',
      },
    },
    {
      name: Weapons.Knife,
      category: WeaponCategories.Melee,
      image: 'knife.webp',
      slot: 'n/a',
      qualities: {
        [WeaponQualities.Common]: 23,
      },
    },
    {
      name: Weapons.Fist,
      category: WeaponCategories.Melee,
      image: 'fist.png',
      slot: 'n/a',
      qualities: {
        [WeaponQualities.Common]: 22,
      },
    },
    {
      name: Weapons.BobArm,
      category: WeaponCategories.Melee,
      image: 'bob_arm.png',
      slot: 'n/a',
      qualities: {
        [WeaponQualities.Common]: 25,
      },
    },
  ],
};