import { Radio, RadioGroup } from '@mantine/core';
import { useRecoilState } from 'recoil';
import SelectedRarityState from '@components/weapons/SelectedRarityState';
import { WeaponCategories, WeaponRarities } from '@components/weapons/types';

export default function WeaponsQuicklinks() {
  const [selectedRarity, setSelectedRarity] = useRecoilState(SelectedRarityState);

  return (
    <div className="border-left-subtle pl-3">
      <div className="border-bottom-subtle pb-3">
        <strong>Rarity</strong>

        <RadioGroup
          variant="vertical"
          defaultValue={selectedRarity}
          defaultChecked={true}
          className="select-none"
          onChange={(e) => setSelectedRarity(e as WeaponRarities)}
        >
          {Object.values(WeaponRarities).reverse().map((rarity) => (
            <Radio key={rarity} value={rarity}>{rarity}</Radio>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2 pt-3">
        <strong>Categories</strong>

        {Object.values(WeaponCategories).map((category) => (
          <a key={category} href={`#${category}`} className="hover:bg-white/10 block capitalize">{category}</a>
        ))}
      </div>
    </div>
  );
}