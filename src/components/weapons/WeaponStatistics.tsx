import { WeaponCategories, WeaponDefinition } from '@components/weapons/types';
import { useRecoilValue } from 'recoil';
import SelectedQualityState from '@components/weapons/SelectedQualityState';
import IndividualStatistic from '@components/weapons/IndividualStatistic';
import { Info } from 'react-feather';
import { getWeaponQuality } from '@components/weapons/utils';

type Props = {
  weapon: WeaponDefinition;
};

export default function WeaponStatistics({weapon}: Props) {
  const selectedQuality = useRecoilValue(SelectedQualityState);
  const weaponQuality = getWeaponQuality(weapon, selectedQuality);

  return (
    <div className="border-top-subtle mt-5">
      <div className="grid grid-cols-12 gap-1">
        {weapon.category !== WeaponCategories.Melee && (
          <>
            <IndividualStatistic
              tooltipLabel={<div>
                <b>Magazine size</b>
                <br/>
                <span>How many bullets available in magazine</span>
              </div>}
              icon="magazine_size.svg"
              value={weaponQuality.magazineSize}
              upgrade={weapon.upgrades.magazineSize}
              fractionDigits={0}
            />

            <IndividualStatistic
              tooltipLabel={<div>
                <b>Reload speed</b>
                <br/>
                <span>How much time it takes to reload weapon</span>
              </div>}
              icon="reload_time.svg"
              value={weaponQuality.reloadSpeed}
              upgrade={weapon.upgrades.reloadSpeed}
            />

            <IndividualStatistic
              tooltipLabel={<div>
                <b>Bullet penetration</b>
                <br/>
                <span>Penetrated damage is multiplied by this value, and gets reduced by 0.25 everytime it penetrates a common Ridden, and by 1.0 for every special</span>
              </div>}
              icon="bullet_penetration.svg"
              value={weaponQuality.bulletPenetrationMultiplier}
              upgrade={weapon.upgrades.bulletPenetrationMultiplier}
            />
          </>
        )}

        {/*Create an empty offset for aligning melee statistics*/}
        {weapon.category === WeaponCategories.Melee && <div className="col-span-3"/>}

        <IndividualStatistic
          tooltipLabel={<div>
            <b>Stumble power multiplier</b>
            <br/>
            <span>How much damage applies as stumble damage (%)</span>
          </div>}
          icon="stumble_power.svg"
          value={weaponQuality.stumblePowerMultiplier}
          upgrade={weapon.upgrades.stumblePowerMultiplier}
        />

        {weapon.category !== WeaponCategories.Melee && (
          <>
            <IndividualStatistic
              tooltipLabel={<div>
                <b>ADS time in</b>
                <br/>
                <span>Time it takes to Aim Down the Sights</span>
              </div>}
              icon="ads_time_in.svg"
              value={weaponQuality.ads.in}
              upgrade={weapon.upgrades['ads.in']}
            />

            <IndividualStatistic
              tooltipLabel={<div>
                <b>ADS time out</b>
                <br/>
                <span>Time it takes to go from Aim Down Sights back to normal</span>
              </div>}
              icon="ads_time_out.svg"
              value={weaponQuality.ads.out}
              upgrade={weapon.upgrades['ads.out']}
            />
          </>
        )}

        <IndividualStatistic
          tooltipLabel={<div>
            <b>Swap time in</b>
            <br/>
            <span>Time it takes to pull out this weapon</span>
          </div>}
          icon="swap_time_in.svg"
          value={weaponQuality.swap.in}
          upgrade={weapon.upgrades['swap.in']}
        />

        <IndividualStatistic
          tooltipLabel={<div>
            <b>Swap time out</b>
            <br/>
            <span>Time it takes to put away this weapon</span>
          </div>}
          icon="swap_time_out.svg"
          value={weaponQuality.swap.out}
          upgrade={weapon.upgrades['swap.out']}
        />

        <IndividualStatistic
          tooltipLabel={<div>
            <b>Move speed jog</b>
            <br/>
            <span>Movement speed while Jogging (not Sprinting)</span>
          </div>}
          icon="move_speed_jog.svg"
          value={weaponQuality.movementSpeed.jog}
          upgrade={weapon.upgrades['movementSpeed.jog']}
          fractionDigits={0}
        />

        <IndividualStatistic
          tooltipLabel={<div>
            <b>Move speed hipfire</b>
            <br/>
            <span>Movement speed while standing and hip firing</span>
          </div>}
          icon="move_speed_hip_fire.svg"
          value={weaponQuality.movementSpeed.hipfire}
          upgrade={weapon.upgrades['movementSpeed.hipfire']}
          fractionDigits={0}
        />

        <IndividualStatistic
          tooltipLabel={<div>
            <b>Move speed ADS</b>
            <br/>
            <span>Movement speed while standing and ADS but not firing</span>
          </div>}
          icon="move_speed_ads_no_fire.svg"
          value={weaponQuality.movementSpeed.ads}
          upgrade={weapon.upgrades['movementSpeed.ads']}
          fractionDigits={0}
        />

        <IndividualStatistic
          tooltipLabel={<div>
            <b>Move speed other</b>
            <br/>
            <span>Movement speed in other situations (crouched / crouched & hip firing / crouched & ADS & no fire / crouched & ADS & firing / standing & ADS & firing)</span>
          </div>}
          icon="move_speed_other.svg"
          value={weaponQuality.movementSpeed.other}
          upgrade={weapon.upgrades['movementSpeed.other']}
          fractionDigits={0}
        />
      </div>

      {weapon.notes && (
        <div className="px-3 py-2">
          <p>
            <b className="flex">Notes <Info size={16} className="ml-1 relative top-[3px]"/></b>

            {Object.keys(weapon.notes).map(note => (
              <div key="note">
                <b>{note}:</b>
                <p>{weapon.notes![note]}</p>
              </div>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}