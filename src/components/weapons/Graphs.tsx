import { WeaponCategories, WeaponDefinition } from '@components/weapons/types';
import OrderedWeaponsPerStatistic from '@components/weapons/charts/OrderedWeaponsPerStatistic';

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
          title="Damage Per Second"
          weapons={overallWeapons.filter(weapon => weapon.category !== WeaponCategories.Bow)}
          statisticCallback={weapon => (weapon.trueDps)}
        />
      </div>

      <div className="mb-12">
        <OrderedWeaponsPerStatistic
          title="Full Magazine Damage"
          weapons={overallWeapons.filter(weapon => weapon.category !== WeaponCategories.Melee && weapon.category !== WeaponCategories.Bow)}
          statisticCallback={weapon => (weapon.fullMagazineDamage)}
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