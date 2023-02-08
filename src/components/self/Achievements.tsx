import { useRecoilValue } from 'recoil';
import StatisticsState from '@components/self/StatisticsState';
import ProgressMilestones from '@components/common/ProgressMilestones';
import Statistics from '@components/statistics/Statistics';
import { MiscellaneousStatistics, Riddens, Weapons, WeaponTypes } from '@components/statistics/types';
import { createRef } from 'react';
import { useMantineTheme } from '@mantine/core';
import { currentCleanerOrder, getCleanerIdsByNames, getCleanerNameById, getFormattedDate } from '@utils/generic';
import ScreenshotTaker from '@components/common/ScreenshotTaker';
import SelectedProgressionTypeState from '@components/self/SelectedProgressionTypeState';

export default function Achievements() {
  const elementToScreenshotRef = createRef<HTMLDivElement>();
  const statistics = useRecoilValue(StatisticsState);
  const progressionType = useRecoilValue(SelectedProgressionTypeState);
  const theme = useMantineTheme();
  const cleanerIds = getCleanerIdsByNames(currentCleanerOrder);

  return (
    <div ref={elementToScreenshotRef} id="achievements" className="mt-7" style={{backgroundColor: theme.colors.dark[8]}}>
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold mb-5">Achievements</h2>
        <ScreenshotTaker elementToScreenshotRef={elementToScreenshotRef} filename={`b4bstats_mazz__achievements__${getFormattedDate()}`}/>
      </div>

      <div className="grid grid-cols-12 gap-x-4 gap-y-10">
        <div className="col-span-4">
          <ProgressMilestones
            title="Drop 1 000 000 ammo"
            maxValue={1_000_000}
            currentValue={statistics.miscellaneousStatistics[MiscellaneousStatistics.AmmoDropped]}
          />
        </div>

        <div className="col-span-4">
          <ProgressMilestones
            title="Open 100 treasures doors"
            maxValue={100}
            currentValue={statistics.miscellaneousStatistics[MiscellaneousStatistics.TreasureDoorsOpened]}
          />
        </div>

        <div className="col-span-4">
          <ProgressMilestones
            title="Play 10 000 cards"
            maxValue={10_000}
            currentValue={statistics.miscellaneousStatistics[MiscellaneousStatistics.CardsPlayed]}
            milestones={[
              {step: 1000},
              {step: 5000},
            ]}
          />
        </div>

        <div className="col-span-4">
          <ProgressMilestones
            title="Complete 1 000 missions"
            maxValue={1000}
            currentValue={statistics.missionsStatistics[progressionType].missionsCompleted}
            milestones={[
              {step: 250},
              {step: 500},
            ]}
          />
        </div>

        <div className="col-span-4">
          <ProgressMilestones
            title="Kill 1 000 cleaners in Swarm"
            maxValue={1000}
            currentValue={statistics.pvpStatistics.killsAsRidden}
            milestones={[
              {step: 100},
              {step: 500},
            ]}
          />
        </div>

        <div className="col-span-4">
          <ProgressMilestones
            title="Kill 2 500 ridden players in Swarm"
            maxValue={2500}
            currentValue={statistics.pvpStatistics.killsAsCleaner}
            milestones={[
              {step: 500},
              {step: 1000},
            ]}
          />
        </div>

        <div className="col-span-4">
          <ProgressMilestones
            title="Win 250 matches of Swarm"
            maxValue={250}
            currentValue={statistics.pvpStatistics.gamesWon}
            milestones={[
              {step: 25},
              {step: 100},
            ]}
          />
        </div>

        <div className="col-span-4">
          <ProgressMilestones
            title="Deal 1 000 000 damage"
            maxValue={1_000_000}
            currentValue={statistics.miscellaneousStatistics[MiscellaneousStatistics.EnemyDamageInflicted]}
          />
        </div>

        <div className="col-span-4">
          <ProgressMilestones
            title="Kill 100 snitches without them triggering a horde"
            maxValue={100}
            currentValue={statistics.miscellaneousStatistics[MiscellaneousStatistics.SnitchersSilenced]}
          />
        </div>

        <div className="col-span-4">
          <ProgressMilestones
            title="Kill 100 000 ridden"
            maxValue={100_000}
            currentValue={statistics.riddenKilled.riddenKilledTotal}
            milestones={[
              {step: 5000},
              {step: 25000},
              {step: 53600},
            ]}
          />
        </div>

        <div className="col-span-4">
          <ProgressMilestones
            title="Kill 3 000 Mutations"
            maxValue={3000}
            currentValue={statistics.riddenKilled.riddenMutationsKilled}
          />
        </div>

        <div className="col-span-4">
          <ProgressMilestones
            title="Kill 1 000 Boss Mutations"
            maxValue={1000}
            currentValue={statistics.riddenKilled.specials[Riddens.Ogre]}
          />
        </div>

        <div className="col-span-4">
          <ProgressMilestones
            title="15 000 Heal applied (self + other)"
            maxValue={15_000}
            currentValue={statistics.miscellaneousStatistics[MiscellaneousStatistics.HealingAppliedOther] + statistics.miscellaneousStatistics[MiscellaneousStatistics.HealingAppliedSelf]}
            milestones={[
              {step: 5000},
            ]}
          />
        </div>

        <div className="col-span-4">
          <ProgressMilestones
            title="Revive 500 cleaners"
            maxValue={500}
            currentValue={statistics.miscellaneousStatistics[MiscellaneousStatistics.CleanersRevived]}
          />
        </div>

        <div className="col-span-4">
          <ProgressMilestones
            title="Rescue 250 cleaners"
            maxValue={250}
            currentValue={statistics.miscellaneousStatistics[MiscellaneousStatistics.CleanersRescued]}
          />
        </div>

        {cleanerIds.map((cleanerId) => (
          <div key={cleanerId} className="col-span-4">
            <ProgressMilestones
              title={`250 Missions completed as ${getCleanerNameById(cleanerId)}`}
              maxValue={250}
              currentValue={statistics.missionsStatistics[progressionType].missionsCompletedPerCleaner[cleanerId].total}
              milestones={[
                {step: 25},
                {step: 50},
                {step: 100},
              ]}
            />
          </div>
        ))}

        <div className="col-span-4">
          <ProgressMilestones
            title="5 000 Sniper Rifle kills"
            maxValue={5000}
            currentValue={Statistics.getKillCountByWeaponType(statistics, WeaponTypes.Sniper)}
            milestones={[
              {step: 500},
              {step: 2500},
            ]}
          />
        </div>

        <div className="col-span-4">
          <ProgressMilestones
            title="5 000 Assault Rifle kills"
            maxValue={5000}
            currentValue={Statistics.getKillCountByWeaponType(statistics, WeaponTypes.AssaultRifle)}
            milestones={[
              {step: 500},
              {step: 2500},
            ]}
          />
        </div>

        <div className="col-span-4">
          <ProgressMilestones
            title="5 000 SMG kills"
            maxValue={5000}
            currentValue={Statistics.getKillCountByWeaponType(statistics, WeaponTypes.SMG)}
            milestones={[
              {step: 500},
              {step: 2500},
            ]}
          />
        </div>

        <div className="col-span-4">
          <ProgressMilestones
            title="5 000 Shotgun kills"
            maxValue={5000}
            currentValue={Statistics.getKillCountByWeaponType(statistics, WeaponTypes.Shotgun)}
            milestones={[
              {step: 500},
              {step: 2500},
            ]}
          />
        </div>

        <div className="col-span-4">
          <ProgressMilestones
            title="5 000 Pistol kills"
            maxValue={5000}
            currentValue={Statistics.getKillCountByWeaponType(statistics, WeaponTypes.Handgun)}
            milestones={[
              {step: 500},
              {step: 2500},
            ]}
          />
        </div>

        <div className="col-span-4">
          <ProgressMilestones
            title="5 000 LMG kills"
            maxValue={5000}
            currentValue={Statistics.getKillCountByWeaponType(statistics, WeaponTypes.LMG)}
            milestones={[
              {step: 500},
              {step: 2500},
            ]}
          />
        </div>

        <div className="col-span-4">
          <ProgressMilestones
            title="5 000 Melee kills"
            maxValue={5000}
            currentValue={Statistics.getKillCountByWeaponType(statistics, WeaponTypes.Melee) + statistics.weaponsKills[Weapons.Fist] + statistics.weaponsKills[Weapons.BobArm]}
            milestones={[
              {step: 500},
              {step: 2500},
            ]}
          />
        </div>
      </div>
    </div>
  );
}