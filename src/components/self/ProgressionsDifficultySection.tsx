import { Cleaners, Difficulties, Missions, Progressions } from '@components/statistics/types';
import { Divider } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import DifficultyFiltersState from '@components/self/DifficultyFiltersState';
import ProgressionsDisplayMission from '@components/self/ProgressionsDisplayMission';

type Props = {
  progressions: Progressions
  cleaner: Cleaners
  difficulty: Difficulties
}

export default function ProgressionsDifficultySection({progressions, cleaner, difficulty}: Props) {
  const {t} = useTranslation();
  const difficultiesFilter = useRecoilValue(DifficultyFiltersState);

  const maxMissionsCompletedCount = difficulty === Difficulties.Swarm ? 18 : 33;
  let missionsCompletedCount = 0;

  // Increment missions completed based on cleaner progression
  Object.values(progressions[cleaner][difficulty]).forEach((value: boolean) => value ? missionsCompletedCount++ : null);

  const isPvpDifficulty = difficulty === Difficulties.Swarm;

  if (!difficultiesFilter.showRecruit && difficulty === Difficulties.Recruit) {
    return null;
  }

  if (!difficultiesFilter.showVeteran && difficulty === Difficulties.Veteran) {
    return null;
  }

  if (!difficultiesFilter.showNightmare && difficulty === Difficulties.Nightmare) {
    return null;
  }

  if (!difficultiesFilter.showNoHope && difficulty === Difficulties.NoHope) {
    return null;
  }

  if (!difficultiesFilter.showSwarm && difficulty === Difficulties.Swarm) {
    return null;
  }

  return (
    <div>
      <div className="text-2xl mb-3">
        <strong>{t(`difficulties.${difficulty}`)}</strong> <span style={{fontSize: '75%'}}>- {missionsCompletedCount}/{maxMissionsCompletedCount}</span>
      </div>

      <div className="grid grid-cols-12">
        <div className="col-span-3">
          <strong>{t('acts.act_1')}</strong>

          <div className="mt-3">
            <strong>{t('segments.1_1')}</strong>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.Resurgence}/>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.TunnelOfBlood}/>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.PainTrain}/>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.TheCrossing}/>
          </div>

          {!isPvpDifficulty && (
            <div className="mt-3">
              <strong>{t('segments.1_2')}</strong>
              <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.ACleanSweep}/>
              <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.BookWorms}/>
              <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.BarRoomBlitz}/>
            </div>
          )}

          {!isPvpDifficulty && (
            <div className="mt-3">
              <strong>{t('segments.1_3')}</strong>
              <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.SpecialDelivery}/>
              <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.TheDiner}/>
            </div>
          )}

          <div className="mt-3">
            <strong>{t('segments.1_4')}</strong>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.BadSeeds}/>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.HellsBells}/>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.Abandoned}/>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.TheSoundOfThunder}/>
          </div>
        </div>

        <div className="col-span-3">
          <strong>{t('acts.act_2')}</strong>

          {!isPvpDifficulty && (
            <div className="mt-3">
              <strong>{t('segments.2_1')}</strong>
              <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.ACallToArms}/>
              <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.TheHandyMan}/>
            </div>
          )}

          <div className="mt-3">
            <strong>{t('segments.2_2')}</strong>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.PipeCleaners}/>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.Hinterland}/>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.TrailerTrashed}/>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.TheClog}/>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.TheBrokenBird}/>
          </div>

          <div className="mt-3">
            <strong>{t('segments.2_3')}</strong>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.HeraldsOfTheWormPart1}/>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.HeraldsOfTheWormPart2}/>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.GraveDanger}/>
          </div>
        </div>

        <div className="col-span-3">
          <strong>{t('acts.act_3')}</strong>

          <div className="mt-3">
            <strong>{t('segments.3_1')}</strong>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.FartherAfield}/>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.BlazingTrails}/>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.CabinsByTheLake}/>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.GardenParty}/>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.T5}/>
          </div>

          <div className="mt-3">
            <strong>{t('segments.3_2')}</strong>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.AFriendInNeed}/>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.MakingTheGrade}/>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.TheRoadToHell}/>
            <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.TheBodyDump}/>
          </div>
        </div>

        {!isPvpDifficulty && (
          <div className="col-span-3">
            <strong>{t('acts.act_4')}</strong>

            <div className="mt-3">
              <strong>{t('segments.4')}</strong>
              <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.TheAbomination}/>
            </div>

            <div className="mt-3">
              <strong>{t('segments.hives')}</strong>
              <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.TheCut}/>
              <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.BloodStream}/>
              <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.CausticCesspool}/>
              <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.SunkenPassage}/>
              <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.BroodLair}/>
              <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.Below300}/>
              <ProgressionsDisplayMission progressions={progressions} cleaner={cleaner} difficulty={difficulty} mission={Missions.TheNursery}/>
            </div>
          </div>
        )}
      </div>

      <Divider variant="dashed" my={30}/>
    </div>
  );
}