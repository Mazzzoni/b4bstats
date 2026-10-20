import { Badge } from '@mantine/core';
import { WeaponQualityColors } from '@utils/colors';
import { WeaponQualities } from '@components/weapons/types';
import { getDamageStatistics } from '@components/weapons/utils';

export type TooltipProps = {
  meter: number;
  damages: ({
    quality: string;
    damage: number;
  } & ReturnType<typeof getDamageStatistics>)[];
  isMelee: boolean;
  isBow: boolean;
};

export default function ChartTooltip(props: TooltipProps) {
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
            {!props.isBow && <th className="pr-5">Raw DPS</th>}
            {!props.isMelee && !props.isBow && <th className="pr-5">Sustained DPS</th>}
            {!props.isMelee && !props.isBow && <th className="pr-5">FMD</th>}
            {!props.isBow && <th className="pr-5">Stumble</th>}
            {!props.isBow && <th className="pr-5">SPS</th>}
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

              {!props.isBow &&
                <td
                  className="pr-5 pt-1 border-top-subtle"
                  style={{color: WeaponQualityColors[row.quality as WeaponQualities]}}
                >
                  {row.rawDps.toFixed(2)}
                </td>
              }

              {!props.isMelee && !props.isBow &&
                <td
                  className="pr-5 pt-1 border-top-subtle"
                  style={{color: WeaponQualityColors[row.quality as WeaponQualities]}}
                >
                  {row.sustainedDps.toFixed(2)}
                </td>
              }

              {!props.isMelee && !props.isBow &&
                <td
                  className="pr-5 pt-1 border-top-subtle"
                  style={{color: WeaponQualityColors[row.quality as WeaponQualities]}}
                >
                  {row.fullMagazineDamage.toFixed(2)}
                </td>
              }

              {!props.isBow &&
                <td
                  className="pr-5 pt-1 border-top-subtle"
                  style={{color: WeaponQualityColors[row.quality as WeaponQualities]}}
                >
                  {row.stumblePerShot.toFixed(2)}
                </td>
              }

              {!props.isBow &&
                <td
                  className="pr-5 pt-1 border-top-subtle"
                  style={{color: WeaponQualityColors[row.quality as WeaponQualities]}}
                >
                  {row.stumblePerSecond.toFixed(2)}
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
