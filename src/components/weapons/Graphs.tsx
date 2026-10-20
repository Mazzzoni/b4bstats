import { WeaponCategories, WeaponDefinition } from '@components/weapons/types';
import OrderedWeaponsPerStatistic from '@components/weapons/charts/OrderedWeaponsPerStatistic';
import { getDamageStatistics } from '@components/weapons/utils';

type Props = {
  sortedWeapons: Record<WeaponDefinition['category'], WeaponDefinition[]>;
}

export default function Graphs({sortedWeapons}: Props) {
  let overallWeapons: WeaponDefinition[] = [];

  for (const weapons of Object.values(sortedWeapons)) {
    overallWeapons = [...overallWeapons, ...weapons];
  }

  return (
    <div id="graphs" className="mb-12">
      <h2 className="text-2xl font-bold mb-3">Graphs</h2>

      <div className="mb-12">
        <OrderedWeaponsPerStatistic
          title="Base Damage"
          weapons={overallWeapons}
          statisticCallback={weapon => (weapon.rangeDamagesComputed[0])}
        />
      </div>

      <div className="mb-12">
        <OrderedWeaponsPerStatistic
          title="Raw DPS (without reloads)"
          weapons={overallWeapons.filter(weapon => weapon.category !== WeaponCategories.Bow)}
          statisticCallback={weapon => getDamageStatistics(weapon).rawDps}
        />
      </div>

      <div className="mb-12">
        <OrderedWeaponsPerStatistic
          title="Sustained DPS (including reloads)"
          weapons={overallWeapons.filter(weapon => weapon.category !== WeaponCategories.Bow)}
          statisticCallback={weapon => getDamageStatistics(weapon).sustainedDps}
        />
      </div>

      <div className="mb-12">
        <OrderedWeaponsPerStatistic
          title="Full Magazine Damage"
          weapons={overallWeapons.filter(weapon => weapon.category !== WeaponCategories.Melee && weapon.category !== WeaponCategories.Bow)}
          statisticCallback={weapon => getDamageStatistics(weapon).fullMagazineDamage}
        />
      </div>

      <div className="mb-12">
        <OrderedWeaponsPerStatistic
          title="Stumble Per Shot"
          weapons={overallWeapons.filter(weapon => weapon.category !== WeaponCategories.Bow)}
          statisticCallback={weapon => (weapon.stumblePerShot)}
        />
      </div>

      <div className="mb-12">
        <OrderedWeaponsPerStatistic
          title="Stumble Per Second"
          weapons={overallWeapons.filter(weapon => weapon.category !== WeaponCategories.Bow)}
          statisticCallback={weapon => (weapon.stumblePerSecond)}
        />
      </div>

      <div className="mb-12">
        <OrderedWeaponsPerStatistic
          title="RPM"
          weapons={overallWeapons.filter(weapon => weapon.category !== WeaponCategories.Bow)}
          statisticCallback={weapon => (weapon.rpm)}
        />
      </div>
    </div>
  );
}
