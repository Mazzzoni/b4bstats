import { ActionIcon, Menu } from '@mantine/core';
import { WeaponDefinition } from '@components/weapons/types';

type Props = {
  weapon: WeaponDefinition
}

export default function WeaponAttachments({weapon}: Props) {
  const borderBarrel = weapon.attachments.barrel ? 'border-white' : 'border-red-600';
  const borderMagazine = weapon.attachments.magazine ? 'border-white' : 'border-red-600';
  const borderScope = weapon.attachments.scope ? 'border-white' : 'border-red-600';
  const borderStock = weapon.attachments.stock ? 'border-white' : 'border-red-600';

  return (
    <div className="mt-5 flex justify-center space-x-4">
      <Menu withArrow control={
        <ActionIcon style={{width: 36, height: 36}} className={`border-2 border-dashed ${borderBarrel}`}>
          <div style={{backgroundImage: `url(/images/icons/barrel.webp)`, width: 32, height: 32}} className="bg-center bg-cover bg-no-repeat"/>
        </ActionIcon>
      }>
        <Menu.Label>Barrels</Menu.Label>
        {/*TODO: Loop over attachment available*/}
      </Menu>

      <Menu withArrow control={
        <ActionIcon style={{width: 36, height: 36}} className={`border-2 border-dashed ${borderMagazine}`}>
          <div style={{backgroundImage: `url(/images/icons/magazine.webp)`, width: 28, height: 28}} className="bg-center bg-cover bg-no-repeat"/>
        </ActionIcon>
      }>
        <Menu.Label>Magazines</Menu.Label>
        {/*TODO: Loop over attachment available*/}
      </Menu>

      <Menu withArrow control={
        <ActionIcon style={{width: 36, height: 36}} className={`border-2 border-dashed ${borderScope}`}>
          <div style={{backgroundImage: `url(/images/icons/scope.webp)`, width: 26, height: 26}} className="bg-center bg-cover bg-no-repeat"/>
        </ActionIcon>
      }>
        <Menu.Label>Scopes</Menu.Label>
        {/*TODO: Loop over attachment available*/}
      </Menu>

      <Menu withArrow control={
        <ActionIcon style={{width: 36, height: 36}} className={`border-2 border-dashed ${borderStock}`}>
          <div style={{backgroundImage: `url(/images/icons/stock.webp)`, width: 28, height: 28}} className="bg-center bg-cover bg-no-repeat"/>
        </ActionIcon>
      }>
        <Menu.Label>Stocks</Menu.Label>
        {/*TODO: Loop over attachment available*/}
      </Menu>
    </div>
  );
}