import { WeaponCategories, WeaponDefinition } from '@components/weapons/types';
import { Badge } from '@mantine/core';
import WeaponAttachments from '@components/weapons/WeaponAttachments';
import WeaponDamage from '@components/weapons/charts/WeaponDamage';
import WeaponOverview from '@components/weapons/WeaponOverview';
import WeaponStatistics from '@components/weapons/WeaponStatistics';
import { useTranslation } from 'react-i18next';

type Props = {
  weapon: WeaponDefinition;
};

export default function WeaponCard({ weapon }: Props) {
  const { t } = useTranslation();

  return (
    <div className="mb-6 overflow-hidden rounded border border-line bg-panel">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full border-b border-line lg:w-1/3 lg:border-r lg:border-b-0">
          <Badge fullWidth size="xl">
            {t(`weapons.${weapon.name}`)}
          </Badge>

          <div>
            <WeaponOverview weapon={weapon} />
          </div>

          {weapon.category !== WeaponCategories.Melee &&
            weapon.category !== WeaponCategories.Bow && (
              <div>
                <WeaponAttachments weapon={weapon} />
              </div>
            )}

          <div>
            <WeaponStatistics weapon={weapon} />
          </div>
        </div>

        <div className="min-w-0 w-full lg:w-2/3">
          <WeaponDamage weapon={weapon} />
        </div>
      </div>

      {/*TODO: Integrate weapon simulator (to calculate damage with multiple factors)*/}
      {/*<div>*/}
      {/*  <WeaponSimulator weapon={weapon}/>*/}
      {/*</div>*/}
    </div>
  );
}
