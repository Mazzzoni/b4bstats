// Run script with:
// http://localhost:3000/api/parse-riddens

import * as csv from '@fast-csv/parse';
import * as fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { Difficulties } from '@components/statistics/types';
import { RiddenCategories, RiddenDefinition } from '@components/riddens/types';

const file = `${process.cwd()}/data/riddens/sheets/kaemanden-riddens-2022-09-17.csv`;

class Saver
{
  save(allRiddens: Parser['riddens'])
  {
    for (const difficulty in allRiddens) {
      const rawRiddens = allRiddens[difficulty as Difficulties];
      const otherRiddens = this.getOtherRiddens(difficulty as Difficulties);
      const riddens = [...Array.from(rawRiddens.values()), ...otherRiddens];

      this.writeFile(difficulty as Difficulties, riddens);
    }
  }

  private getOtherRiddens(difficulty: Difficulties): RiddenDefinition[]
  {
    let otherRiddensFile: string;

    switch (difficulty) {
      case Difficulties.Recruit:
        otherRiddensFile = `${process.cwd()}/data/riddens/recruit/other.json`;
        break;

      case Difficulties.Veteran:
        otherRiddensFile = `${process.cwd()}/data/riddens/veteran/other.json`;
        break;

      case Difficulties.Nightmare:
        otherRiddensFile = `${process.cwd()}/data/riddens/nightmare/other.json`;
        break;

      case Difficulties.NoHope:
        otherRiddensFile = `${process.cwd()}/data/riddens/nohope/other.json`;
        break;

      case Difficulties.Legendary:
        otherRiddensFile = `${process.cwd()}/data/riddens/legendary/other.json`;
        break;

      case Difficulties.Swarm:
        otherRiddensFile = `${process.cwd()}/data/riddens/swarm/other.json`;
        break;
    }

    const file = fs.readFileSync(otherRiddensFile, 'utf8');

    return JSON.parse(file);
  }

  private writeFile(difficulty: Difficulties, riddens: RiddenDefinition[]): void
  {
    let riddenFile: string;

    switch (difficulty) {
      case Difficulties.Recruit:
        riddenFile = `${process.cwd()}/data/riddens/recruit/riddens.json`;
        break;

      case Difficulties.Veteran:
        riddenFile = `${process.cwd()}/data/riddens/veteran/riddens.json`;
        break;

      case Difficulties.Nightmare:
        riddenFile = `${process.cwd()}/data/riddens/nightmare/riddens.json`;
        break;

      case Difficulties.NoHope:
        riddenFile = `${process.cwd()}/data/riddens/nohope/riddens.json`;
        break;

      case Difficulties.Legendary:
        riddenFile = `${process.cwd()}/data/riddens/legendary/riddens.json`;
        break;

      case Difficulties.Swarm:
        riddenFile = `${process.cwd()}/data/riddens/swarm/riddens.json`;
        break;
    }

    fs.writeFileSync(riddenFile, JSON.stringify(riddens, null, 2));
  }
}

class Parser
{
  public riddens: Record<Difficulties, Map<RiddenDefinition['name'], RiddenDefinition>> = {
    [Difficulties.Recruit]: new Map<RiddenDefinition['name'], RiddenDefinition>(),
    [Difficulties.Veteran]: new Map<RiddenDefinition['name'], RiddenDefinition>(),
    [Difficulties.Nightmare]: new Map<RiddenDefinition['name'], RiddenDefinition>(),
    [Difficulties.NoHope]: new Map<RiddenDefinition['name'], RiddenDefinition>(),
    [Difficulties.Legendary]: new Map<RiddenDefinition['name'], RiddenDefinition>(),
    [Difficulties.Swarm]: new Map<RiddenDefinition['name'], RiddenDefinition>(),
  };

  parse(row: any): void
  {
    let ridden: RiddenDefinition;
    const riddenName = this.getRiddenName(row.Monster);
    const difficulty = this.getDifficulty(row.Difficulty);
    const savedRidden = this.riddens[difficulty].get(riddenName);

    if (savedRidden) {
      ridden = savedRidden;
    } else {
      ridden = {} as RiddenDefinition;
    }

    ridden.name = riddenName;
    ridden.category = this.getCategory(riddenName);
    ridden.image = this.getImage(riddenName);
    const healthRank = row.Rank === 'None' ? 'Standard' : row.Rank;

    if (typeof ridden.health === 'object') {
      ridden.health[healthRank] = +row.HP;
    } else {
      ridden.health = {
        [healthRank]: +row.HP,
      };
    }

    ridden.stumble = {
      health: +row['Stumble HP'],
      recovery: +row['Stumble Regen'],
    };

    const weakspotMultiplier = +row.WS_Multiplier;
    const stumbleWeakspotMultiplier = +row['Stumble WS Multiplier'];

    if (weakspotMultiplier) {
      ridden.weakspot_multiplier = weakspotMultiplier;
    }

    if (stumbleWeakspotMultiplier) {
      ridden.stumble.weakspot_multiplier = stumbleWeakspotMultiplier;
    }

    this.riddens[difficulty].set(ridden.name, ridden);
  }

  /**
   * Convert raw name to final one
   */
  private getRiddenName(rawName: string): string
  {
    switch (rawName) {
      case 'CultistMelee':
        return 'Slasher';
      case 'CultistGrenadier':
        return 'Pusflinger';
      case 'CultistArcher':
        return 'Crone';
      case 'CultistSniper':
        return 'Sniper';
    }

    return rawName;
  }

  private getDifficulty(rawDifficulty: string): Difficulties
  {
    switch (rawDifficulty) {
      case 'Recruit':
        return Difficulties.Recruit;
      case 'Veteran':
        return Difficulties.Veteran;
      case 'Nightmare':
        return Difficulties.Nightmare;
      case 'No Hope':
        return Difficulties.NoHope;
      default:
        throw Error(`Unexpected difficulty (${rawDifficulty})`);
    }
  }

  private getCategory(rawName: string): RiddenCategories
  {
    switch (rawName) {
      case 'Common':
      case 'Armored Common':
      case 'Festering':
        return RiddenCategories.Commons;

      case 'Retch':
      case 'Reeker':
      case 'Exploder':
      case 'Shredder':
        return RiddenCategories.Reekers;

      case 'Tallboy':
      case 'Bruiser':
      case 'Crusher':
      case 'Ripper':
        return RiddenCategories.Tallboys;

      case 'Stinger':
      case 'Hocker':
      case 'Stalker':
      case 'Urchin':
        return RiddenCategories.Stingers;

      case 'Slasher':
      case 'Crone':
      case 'Pusflinger':
      case 'Sniper':
        return RiddenCategories.Cultists;

      case 'Ogre':
      case 'Breaker':
        return RiddenCategories.Bosses;

      case 'Snitch':
      case 'Hag':
        return RiddenCategories.Specials;

      default:
        throw Error(`Unexpected ridden (${rawName})`);
    }
  }

  private getImage(rawName: string): string
  {
    switch (rawName) {
      case 'Common':
        return 'common.webp';
      case 'Armored Common':
        return 'armored_common.webp';
      case 'Festering':
        return 'festering.png';

      case 'Retch':
        return 'retch.png';
      case 'Reeker':
        return 'reeker.png';
      case 'Exploder':
        return 'exploder.png';
      case 'Shredder':
        return 'shredder.png';

      case 'Tallboy':
        return 'tallboy.png';
      case 'Bruiser':
        return 'bruiser.png';
      case 'Crusher':
        return 'crusher.png';
      case 'Ripper':
        return 'ripper.png';

      case 'Stinger':
        return 'stinger.png';
      case 'Hocker':
        return 'hocker.png';
      case 'Stalker':
        return 'stalker.png';
      case 'Urchin':
        return 'urchin.png';

      case 'Slasher':
        return 'slasher.webp';
      case 'Crone':
        return 'crone.webp';
      case 'Pusflinger':
        return 'pusflinger.webp';
      case 'Sniper':
        return 'sniper.webp';

      case 'Ogre':
        return 'ogre.webp';
      case 'Breaker':
        return 'breaker.webp';

      case 'Snitch':
        return 'snitcher.webp';
      case 'Hag':
        return 'hag.webp';

      default:
        throw Error(`Unexpected ridden (${rawName})`);
    }
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const saver = new Saver();
  const parser = new Parser();

  fs.createReadStream(file)
    .pipe(csv.parse({headers: true}))
    .on('error', (err: any) => console.log(err))
    .on('data', (row: any) => parser.parse(row))
    .on('end', (rowCount: number) => {
      console.log(`Parsed ${rowCount} rows`);
      console.log('Saving riddens...');
      saver.save(parser.riddens);
      console.log('Riddens saved !');
    });

  res.status(200).json({message: 'Parsing done'});
}