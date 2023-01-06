import { useTranslation } from 'react-i18next';
import { Divider, Space, useMantineTheme } from '@mantine/core';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import MissionsCompletedPerCleaner from '@components/self/charts/MissionsCompletedPerCleaner';
import MissionsCompletedPerDifficulty from '@components/self/charts/MissionsCompletedPerDifficulty';
import SwarmGamesPlayed from '@components/self/charts/SwarmGamesPlayed';
import SwarmKills from '@components/self/charts/SwarmKills';
import RiddenKilled from '@components/self/charts/RiddenKilled';
import RiddenKilledPerWeaponOverall from '@components/self/charts/RiddenKilledPerWeaponOverall';
import RiddenKilledPerWeaponType from '@components/self/charts/RiddenKilledPerWeaponType';
import RiddenKilledPerWeaponTypeSet from '@components/self/charts/RiddenKilledPerWeaponTypeSet';
import { WeaponTypes } from '@components/statistics/types';
import { createRef } from 'react';
import { getFormattedDate } from '@utils/generic';
import ScreenshotTaker from '@components/common/ScreenshotTaker';

export default function Graphs() {
  const elementToScreenshotRef = createRef<HTMLDivElement>();
  const theme = useMantineTheme();
  const {t} = useTranslation();

  // Configure defaults options of charts
  Chart.defaults.color = '#fff';
  Chart.defaults.plugins.legend.display = false;
  Chart.defaults.plugins.tooltip.displayColors = false;

  // Register plugins globally
  Chart.register(ChartDataLabels);

  return (
    <div ref={elementToScreenshotRef} id="graphs" className="mt-7" style={{backgroundColor: theme.colors.dark[8]}}>
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold mb-5">Graphs</h2>
        <ScreenshotTaker elementToScreenshotRef={elementToScreenshotRef} filename={`b4bstats_mazz__graphs__${getFormattedDate()}`}/>
      </div>

      <Divider label="Missions" labelPosition="center" variant="dashed" my={30}/>

      <div className="grid grid-cols-12">
        <div className="col-span-8">
          <MissionsCompletedPerCleaner/>
        </div>

        <div className="col-span-4">
          <MissionsCompletedPerDifficulty/>
        </div>
      </div>

      <Divider label="PvP" labelPosition="center" variant="dashed" my={30}/>

      <div className="grid grid-cols-12">
        <div className="col-span-6">
          <SwarmGamesPlayed/>
        </div>

        <div className="col-span-6">
          <SwarmKills/>
        </div>
      </div>

      <Divider label="Special riddens kills" labelPosition="center" variant="dashed" my={30}/>

      <div className="grid grid-cols-12">
        <div className="col-span-12">
          <RiddenKilled/>
        </div>
      </div>

      <Divider label="Weapons kills" labelPosition="center" variant="dashed" my={30}/>

      <div className="grid grid-cols-12">
        <div className="col-span-12">
          <RiddenKilledPerWeaponOverall/>
        </div>
      </div>

      <Space my={50}/>

      <div className="grid grid-cols-12">
        <div className="col-span-4">
          <RiddenKilledPerWeaponType/>
        </div>

        <div className="col-span-8">
          <RiddenKilledPerWeaponTypeSet
            title={t('graphs.ridden_killed_handgun')}
            type={WeaponTypes.Handgun}
          />
        </div>
      </div>

      <Space my={50}/>

      <div className="grid grid-cols-12">
        <div className="col-span-6">
          <RiddenKilledPerWeaponTypeSet
            title={t('graphs.ridden_killed_ar')}
            type={WeaponTypes.AssaultRifle}
          />
        </div>

        <div className="col-span-6">
          <RiddenKilledPerWeaponTypeSet
            title={t('graphs.ridden_killed_shotgun')}
            type={WeaponTypes.Shotgun}
          />
        </div>
      </div>

      <Space my={50}/>

      <div className="grid grid-cols-12">
        <div className="col-span-6">
          <RiddenKilledPerWeaponTypeSet
            title={t('graphs.ridden_killed_smg')}
            type={WeaponTypes.SMG}
          />
        </div>

        <div className="col-span-6">
          <RiddenKilledPerWeaponTypeSet
            title={t('graphs.ridden_killed_melee')}
            type={WeaponTypes.Melee}
          />
        </div>
      </div>

      <Space my={50}/>

      <div className="grid grid-cols-12">
        <div className="col-span-4">
          <RiddenKilledPerWeaponTypeSet
            title={t('graphs.ridden_killed_lmg')}
            type={WeaponTypes.LMG}
          />
        </div>

        <div className="col-span-4">
          <RiddenKilledPerWeaponTypeSet
            title={t('graphs.ridden_killed_sniper')}
            type={WeaponTypes.Sniper}
          />
        </div>

        <div className="col-span-4">
          <RiddenKilledPerWeaponTypeSet
            title={t('graphs.ridden_killed_flamethrower')}
            type={WeaponTypes.Flamethrower}
          />
        </div>
      </div>
    </div>
  );
}