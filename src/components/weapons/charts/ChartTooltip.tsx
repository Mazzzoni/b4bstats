import { Badge } from '@mantine/core';
import { WeaponQualityColors } from '@utils/colors';
import { WeaponQualities } from '@components/weapons/types';

export type TooltipProps = {
  meter: number;
  damages: {
    quality: string;
    damage: number;
  }[];
  baseDamage: number;
  baseFullMagazineDamage: number;
  baseTrueDps: number;
  baseStumblePerShot: number;
  baseStumblePerSecond: number;
  isMelee: boolean;
}

export default function ChartTooltip(props: TooltipProps) {
  const showCell = !props.isMelee;

  return (
    <div className="color-bg-secondary min-w-[200px] border">
      <div className="font-bold text">
        <Badge fullWidth variant="light" size="lg" radius={0}>Distance: {props.meter / 100}m</Badge>
      </div>

      <div className="px-2 py-1">
        <table>
          <thead>
          <tr className="text-left">
            <th className="pr-5">Quality</th>
            <th className="pr-5">Damage</th>
            {showCell && <th className="pr-5">DPS</th>}
            {showCell && <th className="pr-5">FMD</th>}
            <th className="pr-5">Stumble</th>
            {showCell && <th className="pr-5">SPS</th>}
          </tr>
          </thead>

          <tbody className="text-left">
          {props.damages.map((row, index) => (
            <tr key={index}>
              <td
                className="pr-5 pt-1 capitalize font-bold border-top-subtle"
                style={{color: WeaponQualityColors[row.quality as WeaponQualities]}}
              >
                {row.quality}
              </td>

              <td
                className="pr-5 pt-1 border-top-subtle"
                style={{color: WeaponQualityColors[row.quality as WeaponQualities]}}
              >
                {row.damage.toFixed(2)}
              </td>

              {showCell &&
                <td
                  className="pr-5 pt-1 border-top-subtle"
                  style={{color: WeaponQualityColors[row.quality as WeaponQualities]}}
                >
                  {((row.damage * props.baseTrueDps) / props.baseDamage).toFixed(2)}
                </td>
              }

              {showCell &&
                <td
                  className="pr-5 pt-1 border-top-subtle"
                  style={{color: WeaponQualityColors[row.quality as WeaponQualities]}}
                >
                  {((row.damage * props.baseFullMagazineDamage) / props.baseDamage).toFixed(2)}
                </td>
              }

              <td
                className="pr-5 pt-1 border-top-subtle"
                style={{color: WeaponQualityColors[row.quality as WeaponQualities]}}
              >
                {((row.damage * props.baseStumblePerShot) / props.baseDamage).toFixed(2)}
              </td>

              {showCell &&
                <td
                  className="pr-5 pt-1 border-top-subtle"
                  style={{color: WeaponQualityColors[row.quality as WeaponQualities]}}
                >
                  {((row.damage * props.baseStumblePerSecond) / props.baseDamage).toFixed(2)}
                </td>
              }
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}