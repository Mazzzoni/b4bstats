import type Statistics from '@components/statistics/Statistics';
import { ProgressionTypes, WeaponsSorted, WeaponTypes } from '@components/statistics/types';

/** Weapon preference is inferred from kills; the service does not expose weapon playtime. */
export function getPlaystyle(statistics: Statistics) {
  const cleaners = Object.entries(
    statistics.missionsStatistics[ProgressionTypes.Merged].missionsCompletedPerCleaner,
  )
    .map(([id, counts]) => ({ id, total: counts.total }))
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total);
  const cleanerTotal = cleaners.reduce((sum, item) => sum + item.total, 0);
  const cleaner =
    cleaners[0] && cleaners[0].total !== cleaners[1]?.total
      ? { ...cleaners[0], share: cleaners[0].total / cleanerTotal }
      : null;

  const weaponIds = [...new Set(Object.values(WeaponsSorted).flat())];
  const weapons = weaponIds
    .map((id) => ({ id, total: statistics.weaponsKills[id] ?? 0 }))
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total);
  const weaponTotal = weapons.reduce((sum, item) => sum + item.total, 0);
  const top = weapons[0];
  if (!top) return { cleaner, weapon: null };
  // Prefer a category when kills are spread across several weapons.
  if (top.total >= weaponTotal * 0.25 && top.total >= (weapons[1]?.total ?? 0) * 1.5) {
    return { cleaner, weapon: { kind: 'weapon' as const, ...top, share: top.total / weaponTotal } };
  }
  const categories = Object.entries(WeaponsSorted)
    .map(([id, ids]) => ({
      id: id as WeaponTypes,
      total: ids.reduce((sum, weapon) => sum + (statistics.weaponsKills[weapon] ?? 0), 0),
    }))
    .sort((a, b) => b.total - a.total);
  const category = categories[0];
  return {
    cleaner,
    weapon:
      category.total !== categories[1]?.total
        ? { kind: 'type' as const, ...category, share: category.total / weaponTotal }
        : null,
  };
}
