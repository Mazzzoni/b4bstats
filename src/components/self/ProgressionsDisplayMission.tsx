import { Cleaners, Difficulties, Missions, Progressions, SwarmMissions } from '@components/statistics/types';
import { CheckSquare, XSquare } from 'react-feather';
import { useRecoilValue } from 'recoil';
import StatisticsState from '@components/self/StatisticsState';
import { useTranslation } from 'react-i18next';
import SelectedProgressionTypeState from '@components/self/SelectedProgressionTypeState';

type Props = {
  progressions: Progressions
  cleaner: Cleaners
  difficulty: Difficulties
  mission: Missions
}

export default function ProgressionsDisplayMission({progressions, cleaner, difficulty, mission}: Props) {
  const statistics = useRecoilValue(StatisticsState);
  const progressionType = useRecoilValue(SelectedProgressionTypeState);
  const {t} = useTranslation();

  // If we are rendering pvp missions, make sure to show only the ones that are available in that mode
  if (difficulty === Difficulties.Swarm && !SwarmMissions.includes(mission)) {
    return null;
  }

  const missionName = t(`progressions.missions.${mission}`);
  const isDone = progressions[cleaner][difficulty][mission];
  const icon = isDone ? <CheckSquare size={16}/> : <XSquare size={16}/>;
  const missionState = isDone ? 'color-success' : 'color-primary';
  const rawId = `${mission}::${difficulty}::${cleaner}`;
  let completedNumber: number | null = null;

  if (Object.keys(statistics.missionsStatistics[progressionType].missionsCompletedRaw).includes(rawId)) {
    completedNumber = statistics.missionsStatistics[progressionType].missionsCompletedRaw[rawId];
  }

  return (
    <div className={`${missionState} flex`}>
      <span className="relative top-[2px] mr-1">{icon}</span> <span className="mr-1">{missionName}</span> <span style={{fontSize: '85%'}}>{completedNumber && `(${completedNumber})`}</span>
    </div>
  );
}