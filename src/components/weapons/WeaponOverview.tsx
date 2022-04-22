import { WeaponDefinition } from '@components/weapons/types';
import { Badge, Tooltip } from '@mantine/core';

type Props = {
  weapon: WeaponDefinition
}

export default function WeaponOverview({weapon}: Props) {
  return (
    <div className="relative">
      <div className="absolute top-0 right-0">
        <Tooltip label={`Ammo type: ${weapon.ammo}`}>
          <Badge variant="outline" color="dark" size="lg" style={{borderTop: 0, borderRight: 0}}>
            <span
              style={{backgroundImage: `url(/images/icons/ammo_${weapon.ammo}.webp)`}}
              className="block h-4 w-4 bg-no-repeat bg-center bg-cover"
            />
          </Badge>
        </Tooltip>
      </div>

      <div className="absolute bottom-0 right-0">
        <Tooltip label="Rounds Fired per Minute">
          <Badge size="lg">{weapon.rpm} RPM</Badge>
        </Tooltip>
      </div>

      <div className="space-x-2">
        <Tooltip label="Weapon category">
          <Badge color="gray" size="sm">{weapon.category}</Badge>
        </Tooltip>

        <Tooltip label="Weapon slot">
          <Badge color="gray" size="sm">{weapon.slot}</Badge>
        </Tooltip>
      </div>

      <div
        style={{backgroundImage: `url(/images/weapons/${weapon.image})`}}
        className="my-3 h-24 bg-center bg-contain bg-no-repeat"
      />
    </div>
  );
}