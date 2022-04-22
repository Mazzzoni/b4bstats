import { WeaponDefinition } from '@components/weapons/types';

type Props = {
  weapon: WeaponDefinition
}

export default function WeaponStatistics({weapon}: Props) {
  return (
    <div>
      <pre>{JSON.stringify(weapon, null, 2)}</pre>
    </div>
  )
}