import { Radio } from '@mantine/core';
import { useAtom } from 'jotai';
import { WeaponCategories, WeaponQualities } from '@components/weapons/types';
import SelectedQualityState from '@components/weapons/SelectedQualityState';
import { PieChart } from 'react-feather';
export default function WeaponsQuicklinks() {
  const [selectedQuality, setSelectedQuality] = useAtom(SelectedQualityState);
  return (
    <div className="border-left-subtle pl-3">
      <div className="border-bottom-subtle pb-3">
        <strong>Quality</strong>

        <Radio.Group
          value={selectedQuality}
          className="select-none"
          onChange={(e) => setSelectedQuality(e as WeaponQualities)}
        >
          {Object.values(WeaponQualities)
            .reverse()
            .map((rarity) => (
              <Radio key={rarity} value={rarity} className="capitalize" label={rarity} />
            ))}
        </Radio.Group>
      </div>

      <div className="space-y-2 pt-3">
        <strong>Categories</strong>

        {Object.values(WeaponCategories).map((category) => (
          <a
            key={category}
            href={`#${category.toLowerCase()}`}
            className="hover:bg-white/10 block capitalize"
          >
            {category}
          </a>
        ))}

        <a href="#graphs" className="hover:bg-white/10 block capitalize flex items-center">
          <PieChart size={16} className="mr-2 relative top-[-2px]" /> Graphs
        </a>
      </div>
    </div>
  );
}
