import { Radio, RadioGroup } from '@mantine/core';
import { Difficulties } from '@components/statistics/types';
import { useRecoilState } from 'recoil';
import SelectedDifficultyState from '@components/riddens/SelectedDifficultyState';

export default function RiddensQuicklinks() {
  const [selectedDifficulty, setSelectedDifficulty] = useRecoilState(SelectedDifficultyState);

  return (
    <div className="border-left-subtle pl-3">
      <div className="border-bottom-subtle pb-3">
        <strong>Difficulty</strong>

        <RadioGroup
          variant="vertical"
          defaultValue={selectedDifficulty}
          defaultChecked={true}
          className="select-none"
          onChange={(e) => setSelectedDifficulty(e as Difficulties)}
        >
          <Radio value={Difficulties.Easy}>Recruit</Radio>
          <Radio value={Difficulties.Normal}>Veteran</Radio>
          <Radio value={Difficulties.Hard}>Nightmare</Radio>
          <Radio value={Difficulties.NoHope}>No Hope</Radio>
          <Radio value={Difficulties.Pvp}>Swarm</Radio>
        </RadioGroup>
      </div>
      
      <div className="space-y-2 border-bottom-subtle pt-2 pb-3">
        <strong>Types</strong>

        <a href="#Commons" className="hover:bg-white/10 block">Commons</a>
        <a href="#Stingers" className="hover:bg-white/10 block">Stingers</a>
        <a href="#Reekers" className="hover:bg-white/10 block">Reekers</a>
        <a href="#Tallboys" className="hover:bg-white/10 block">Tallboys</a>
        <a href="#Specials" className="hover:bg-white/10 block">Specials</a>
        <a href="#Bosses" className="hover:bg-white/10 block">Bosses</a>
      </div>
    </div>
  );
}