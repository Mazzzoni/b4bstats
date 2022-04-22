import { WeaponDefinition } from '@components/weapons/types';
import { Badge, Tooltip } from '@mantine/core';
import WeaponAttachments from '@components/weapons/WeaponAttachments';
import WeaponSimulator from '@components/weapons/WeaponSimulator';
import WeaponDamage from '@components/weapons/charts/WeaponDamage';
import WeaponOverview from '@components/weapons/WeaponOverview';
import WeaponStatistics from '@components/weapons/WeaponStatistics';

type Props = {
  weapon: WeaponDefinition
}

export default function WeaponCard({weapon}: Props) {
  return (
    <div className="color-bg-secondary">
      <div className="flex">
        <div className="w-1/3 border-right-subtle">
          <Badge fullWidth size="xl">{weapon.name}</Badge>

          <div>
            <WeaponOverview weapon={weapon}/>
          </div>

          <div>
            <WeaponAttachments weapon={weapon}/>
          </div>

          <div className="">
            <WeaponStatistics weapon={weapon}/>
          </div>
        </div>

        <div className="w-2/3">
          <WeaponDamage weapon={weapon}/>
        </div>
      </div>

      <div>
        <WeaponSimulator weapon={weapon}/>
      </div>
    </div>
  );
}