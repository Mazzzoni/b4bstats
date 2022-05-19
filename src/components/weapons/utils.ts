import { WeaponStatisticsDefinition } from '@components/weapons/types';

// Represent 0.5 meter
export const rangedStepSize = 50;

// Represent 0.1 meter
export const meleeStepSize = 10;

export const getDamageData = (range_damages: WeaponStatisticsDefinition['rangeDamages'], metersScale: number[]): number[] => {
  let damages: number[] = [];

  // Format ranges threshold
  const ranges: { range: number, damage: number }[] = [];

  for (const range in range_damages) {
    ranges.push({
      range: +range,
      damage: range_damages[range],
    });
  }

  // Add beginning of range damage
  ranges.unshift({
    range: 0,
    damage: ranges[0].damage,
  });

  // Add ending of range damage
  ranges.push({
    range: metersScale[metersScale.length - 1],
    damage: ranges[ranges.length - 1].damage,
  });

  for (let i = 0; i < ranges.length; i++) {
    const range1 = ranges[i];
    const range2 = ranges[i + 1] || null;

    // Make sure it's not the last set to compute
    if (range2 === null) {
      continue;
    }

    // Determinate how many steps are needed
    let stepsCount = 0;

    for (let j = 0; j < metersScale.length; j++) {
      const range = metersScale[j];

      if (range < range1.range) {
        continue;
      }

      if (range >= range2.range) {
        break;
      }

      stepsCount++;
    }

    // If it's beginning or ending
    if (range1.damage === range2.damage) {
      for (let j = 0; j < stepsCount; j++) {
        damages.push(range1.damage);
      }
    }
    // If it's between two ranges, interpolate value
    else {
      const distance = range1.damage - range2.damage;
      const p = distance / stepsCount;

      for (let j = 0; j < stepsCount; j++) {
        damages.push(range1.damage - (p * j));
      }
    }
  }

  // Duplicate last tick so it fills completely damages range
  damages.push(damages[damages.length - 1]);

  return damages;
};

export const getMetersScale = (max: number, stepSize: number) => {
  let scale = [0];
  let value = 0;

  while (value < max) {
    value += stepSize;
    scale.push(value);
  }

  return scale;
};