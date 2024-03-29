import { WeaponCategories, WeaponDefinition } from '@components/weapons/types';
import { Badge, Tooltip } from '@mantine/core';
import { useRecoilValue } from 'recoil';
import SelectedQualityState from '@components/weapons/SelectedQualityState';
import { getWeaponQuality } from './utils';

type Props = {
  weapon: WeaponDefinition;
};

export default function WeaponOverview({weapon}: Props) {
  const selectedQuality = useRecoilValue(SelectedQualityState);
  const weaponQuality = getWeaponQuality(weapon, selectedQuality);

  return (
    <div className="relative">
      {weapon.category !== WeaponCategories.Melee && (
        <div className="absolute top-0 right-0">
          <Tooltip
            label={<div>
              <b>Ammo type</b>
              <br/>
              <span className="capitalize">{weapon.ammo}</span>
            </div>}
          >
            <Badge variant="outline" color="dark" size="lg" style={{borderTop: 0, borderRight: 0}}>
            <span
              style={{backgroundImage: `url(/images/icons/ammo_${weapon.ammo}.webp)`}}
              className="block h-4 w-4 bg-no-repeat bg-center bg-cover"
            />
            </Badge>
          </Tooltip>
        </div>
      )}

      {weapon.category !== WeaponCategories.Bow && (
        <div className="absolute bottom-0 right-0">
          <Tooltip
            label={<div>
              <b>RPM</b>
              <br/>
              <span>Rounds fired per minute</span>
              <br/>
              <span className="bg-stone-400 px-1">{weaponQuality.rpmFormula} = {weaponQuality.rpm.toFixed(2)}</span>
            </div>}
          >
            <Badge size="lg">{weaponQuality.rpm.toFixed(0)} RPM</Badge>
          </Tooltip>
        </div>
      )}

      <div className="space-x-2">
        <Tooltip
          label={<div>
            <b>Weapon category</b>
            <br/>
            <span className="capitalize">{weapon.category}</span>
          </div>}
        >
          <Badge color="gray" size="sm">{weapon.category}</Badge>
        </Tooltip>

        <Tooltip
          label={<div>
            <b>Weapon slot</b>
            <br/>
            <span className="capitalize">{weapon.slot}</span>
          </div>}
        >
          <Badge color="gray" size="sm">{weapon.slot}</Badge>
        </Tooltip>
      </div>

      <div className="px-3 py-2">
        <div
          style={{backgroundImage: `url(/images/weapons/${weapon.image})`}}
          className="my-3 h-24 bg-center bg-contain bg-no-repeat"
        />
      </div>
    </div>
  );
}