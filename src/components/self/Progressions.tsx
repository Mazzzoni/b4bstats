import { useRecoilValue } from 'recoil';
import StatisticsState from '@components/self/StatisticsState';
import { useTranslation } from 'react-i18next';
import DifficultyFiltersState, { DifficultyFilters } from '@components/self/DifficultyFiltersState';
import { getCleanerNameById, getFormattedDate } from '@utils/generic';
import { Cleaners, Difficulties, Missions, Progressions as StatisticsProgressions, SwarmMissions } from '@components/statistics/types';
import Statistics from '@components/statistics/Statistics';
import { CheckSquare, XSquare } from 'react-feather';
import { Divider, useMantineTheme } from '@mantine/core';
import ScrollSpy from 'react-ui-scrollspy';
import { createRef } from 'react';
import ScreenshotTaker from '@components/common/ScreenshotTaker';

/**
 * Display mission in different manner based if it's done or not
 */
function DisplayMission(progressions: StatisticsProgressions, cleaner: Cleaners, difficulty: Difficulties, mission: Missions, t: Function, stats: Statistics)
{
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

  if (Object.keys(stats.missionsStatistics.missionsCompletedRaw).includes(rawId)) {
    completedNumber = stats.missionsStatistics.missionsCompletedRaw[rawId];
  }

  return (
    <div className={`${missionState} flex`}>
      <span className="relative top-[2px] mr-1">{icon}</span> <span className="mr-1">{missionName}</span> <span style={{fontSize: '85%'}}>{completedNumber && `(${completedNumber})`}</span>
    </div>
  );
}

/**
 * Responsible for rendering a difficulty section
 */
function DifficultySection(progressions: StatisticsProgressions, cleaner: Cleaners, difficulty: Difficulties, filters: DifficultyFilters, t: Function, statistics: Statistics)
{
  const maxMissionsCompletedCount = difficulty === Difficulties.Swarm ? 18 : 33;
  let missionsCompletedCount = 0;

  // Increment missions completed based on cleaner progression
  Object.values(progressions[cleaner][difficulty]).forEach((value: boolean) => value ? missionsCompletedCount++ : null);

  const isPvpDifficulty = difficulty === Difficulties.Swarm;

  if (!filters.showRecruit && difficulty === Difficulties.Recruit) {
    return null;
  }

  if (!filters.showVeteran && difficulty === Difficulties.Veteran) {
    return null;
  }

  if (!filters.showNightmare && difficulty === Difficulties.Nightmare) {
    return null;
  }

  if (!filters.showNoHope && difficulty === Difficulties.NoHope) {
    return null;
  }

  if (!filters.showSwarm && difficulty === Difficulties.Swarm) {
    return null;
  }

  return (
    <div key={difficulty} className="">
      <div className="text-2xl mb-3">
        <strong>{t(`difficulties.${difficulty}`)}</strong> <span style={{fontSize: '75%'}}>- {missionsCompletedCount}/{maxMissionsCompletedCount}</span>
      </div>

      <div className="grid grid-cols-12">
        <div className="col-span-3">
          <strong>{t('acts.act_1')}</strong>

          <div className="mt-3">
            <strong>{t('segments.1_1')}</strong>
            {DisplayMission(progressions, cleaner, difficulty, Missions.Resurgence, t, statistics)}
            {DisplayMission(progressions, cleaner, difficulty, Missions.TunnelOfBlood, t, statistics)}
            {DisplayMission(progressions, cleaner, difficulty, Missions.PainTrain, t, statistics)}
            {DisplayMission(progressions, cleaner, difficulty, Missions.TheCrossing, t, statistics)}
          </div>

          {!isPvpDifficulty && (
            <div className="mt-3">
              <strong>{t('segments.1_2')}</strong>
              {DisplayMission(progressions, cleaner, difficulty, Missions.ACleanSweep, t, statistics)}
              {DisplayMission(progressions, cleaner, difficulty, Missions.BookWorms, t, statistics)}
              {DisplayMission(progressions, cleaner, difficulty, Missions.BarRoomBlitz, t, statistics)}
            </div>
          )}

          {!isPvpDifficulty && (
            <div className="mt-3">
              <strong>{t('segments.1_3')}</strong>
              {DisplayMission(progressions, cleaner, difficulty, Missions.SpecialDelivery, t, statistics)}
              {DisplayMission(progressions, cleaner, difficulty, Missions.TheDiner, t, statistics)}
            </div>
          )}

          <div className="mt-3">
            <strong>{t('segments.1_4')}</strong>
            {DisplayMission(progressions, cleaner, difficulty, Missions.BadSeeds, t, statistics)}
            {DisplayMission(progressions, cleaner, difficulty, Missions.HellsBells, t, statistics)}
            {DisplayMission(progressions, cleaner, difficulty, Missions.Abandoned, t, statistics)}
            {DisplayMission(progressions, cleaner, difficulty, Missions.TheSoundOfThunder, t, statistics)}
          </div>
        </div>

        <div className="col-span-3">
          <strong>{t('acts.act_2')}</strong>

          {!isPvpDifficulty && (
            <div className="mt-3">
              <strong>{t('segments.2_1')}</strong>
              {DisplayMission(progressions, cleaner, difficulty, Missions.ACallToArms, t, statistics)}
              {DisplayMission(progressions, cleaner, difficulty, Missions.TheHandyMan, t, statistics)}
            </div>
          )}

          <div className="mt-3">
            <strong>{t('segments.2_2')}</strong>
            {DisplayMission(progressions, cleaner, difficulty, Missions.PipeCleaners, t, statistics)}
            {DisplayMission(progressions, cleaner, difficulty, Missions.Hinterland, t, statistics)}
            {DisplayMission(progressions, cleaner, difficulty, Missions.TrailerTrashed, t, statistics)}
            {DisplayMission(progressions, cleaner, difficulty, Missions.TheClog, t, statistics)}
            {DisplayMission(progressions, cleaner, difficulty, Missions.TheBrokenBird, t, statistics)}
          </div>

          <div className="mt-3">
            <strong>{t('segments.2_3')}</strong>
            {DisplayMission(progressions, cleaner, difficulty, Missions.HeraldsOfTheWormPart1, t, statistics)}
            {DisplayMission(progressions, cleaner, difficulty, Missions.HeraldsOfTheWormPart2, t, statistics)}
            {DisplayMission(progressions, cleaner, difficulty, Missions.GraveDanger, t, statistics)}
          </div>
        </div>

        <div className="col-span-3">
          <strong>{t('acts.act_3')}</strong>

          <div className="mt-3">
            <strong>{t('segments.3_1')}</strong>
            {DisplayMission(progressions, cleaner, difficulty, Missions.FartherAfield, t, statistics)}
            {DisplayMission(progressions, cleaner, difficulty, Missions.BlazingTrails, t, statistics)}
            {DisplayMission(progressions, cleaner, difficulty, Missions.CabinsByTheLake, t, statistics)}
            {DisplayMission(progressions, cleaner, difficulty, Missions.GardenParty, t, statistics)}
            {DisplayMission(progressions, cleaner, difficulty, Missions.T5, t, statistics)}
          </div>

          <div className="mt-3">
            <strong>{t('segments.3_2')}</strong>
            {DisplayMission(progressions, cleaner, difficulty, Missions.AFriendInNeed, t, statistics)}
            {DisplayMission(progressions, cleaner, difficulty, Missions.MakingTheGrade, t, statistics)}
            {DisplayMission(progressions, cleaner, difficulty, Missions.TheRoadToHell, t, statistics)}
            {DisplayMission(progressions, cleaner, difficulty, Missions.TheBodyDump, t, statistics)}
          </div>
        </div>

        {!isPvpDifficulty && (
          <div className="col-span-3">
            <strong>{t('acts.act_4')}</strong>

            <div className="mt-3">
              <strong>{t('segments.4')}</strong>
              {DisplayMission(progressions, cleaner, difficulty, Missions.TheAbomination, t, statistics)}
            </div>

            <div className="mt-3">
              <strong>{t('segments.hives')}</strong>
              {DisplayMission(progressions, cleaner, difficulty, Missions.TheCut, t, statistics)}
              {DisplayMission(progressions, cleaner, difficulty, Missions.BloodStream, t, statistics)}
              {DisplayMission(progressions, cleaner, difficulty, Missions.CausticCesspool, t, statistics)}
              {DisplayMission(progressions, cleaner, difficulty, Missions.SunkenPassage, t, statistics)}
              {DisplayMission(progressions, cleaner, difficulty, Missions.BroodLair, t, statistics)}
              {DisplayMission(progressions, cleaner, difficulty, Missions.Below300, t, statistics)}
              {DisplayMission(progressions, cleaner, difficulty, Missions.TheNursery, t, statistics)}
            </div>
          </div>
        )}
      </div>

      <Divider variant="dashed" my={30}/>
    </div>
  );
}

export default function Progressions() {
  const elementToScreenshotRef = createRef<HTMLDivElement>();
  const filters = useRecoilValue(DifficultyFiltersState);
  const statistics = useRecoilValue(StatisticsState);
  const progressions = statistics.progressions;
  const theme = useMantineTheme();
  const {t} = useTranslation();

  if (!filters.showRecruit && !filters.showVeteran && !filters.showNightmare && !filters.showNoHope && !filters.showSwarm) {
    return null;
  }

  return (
    <div ref={elementToScreenshotRef} style={{backgroundColor: theme.colors.dark[8]}}>
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold">Progressions</h2>
        <ScreenshotTaker elementToScreenshotRef={elementToScreenshotRef} filename={`b4bstats_mazz__progressions__${getFormattedDate()}`}/>
      </div>

      <ScrollSpy activeClass="bg-white/5" scrollThrottle={100}>
        {Object.keys(progressions).map((cleanerId, i) => (
          <div key={cleanerId} id={getCleanerNameById(cleanerId).toLowerCase()} className="grid gap-4 grid-cols-12">
            <div className="text-center col-span-2">
              <div className="sticky top-[80px] flex flex-col items-center">
                <img
                  className="w-48 inline"
                  src={`/images/cleaners/${getCleanerNameById(cleanerId).toLowerCase()}.webp`}
                  alt={getCleanerNameById(cleanerId)}
                />

                <strong className="mt-3">{t(`cleaners.${cleanerId}`)}</strong>
              </div>
            </div>

            <div className="col-span-10">
              {Object.keys(progressions[cleanerId]).map((difficulty, i) =>
                DifficultySection(progressions, cleanerId as Cleaners, difficulty as Difficulties, filters, t, statistics),
              )}
            </div>
          </div>
        ))}
      </ScrollSpy>
    </div>
  );
}