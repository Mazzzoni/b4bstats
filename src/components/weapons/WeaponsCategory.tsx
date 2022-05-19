import { WeaponDefinition } from '@components/weapons/types';
import WeaponCard from '@components/weapons/WeaponCard';

type Props = {
  categoryName: string
  weapons: WeaponDefinition[]
}

export default function WeaponsCategory({categoryName, weapons}: Props) {
  if (weapons.length === 0) {
    return null;
  }

  return (
    <div id={categoryName.toLowerCase()} className="mb-12">
      <h2 className="text-2xl font-bold mb-3 capitalize">{categoryName}</h2>

      {weapons.map((weapon) => (
        <WeaponCard key={weapon.name} weapon={weapon}/>
      ))}
    </div>
  );
}