import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useTranslation } from 'react-i18next';
import Miscellaneous from '@components/compare/charts/Miscellaneous';
import RiddenKilled from '@components/compare/charts/RiddenKilled';
import RiddenKilledPerWeaponOverall from '@components/compare/charts/RiddenKilledPerWeaponOverall';
import { MiscellaneousStatistics } from '@components/statistics/types';
import { Divider } from '@mantine/core';

export default function Graphs() {
  const {t} = useTranslation();

  // Configure defaults options of charts
  Chart.defaults.color = '#fff';
  Chart.defaults.plugins.legend.display = false;
  Chart.defaults.plugins.tooltip.displayColors = false;

  // Register plugins globally
  Chart.register(ChartDataLabels);

  const miscellaneousGraphs: Record<MiscellaneousStatistics, string> = {
    [MiscellaneousStatistics.AmmoDropped]: t('miscellaneous.statistics.ammo_dropped'),
    [MiscellaneousStatistics.CardsPlayed]: t('miscellaneous.statistics.cards_played'),
    [MiscellaneousStatistics.CaravanItemsPurchased]: t('miscellaneous.statistics.items_purchased_caravan'),
    [MiscellaneousStatistics.CleanersRescued]: t('miscellaneous.statistics.cleaners_rescued'),
    [MiscellaneousStatistics.CleanersRevived]: t('miscellaneous.statistics.cleaners_revived'),
    [MiscellaneousStatistics.CommonRiddenDamageInflicted]: t('miscellaneous.statistics.damage_commons'),
    [MiscellaneousStatistics.SpecialRiddenDamageInflicted]: t('miscellaneous.statistics.damage_mutations'),
    [MiscellaneousStatistics.WeakSpotDamageInflicted]: t('miscellaneous.statistics.damage_weakspot'),
    [MiscellaneousStatistics.EnemyDamageInflicted]: t('miscellaneous.statistics.damage_ridden_overall'),
    [MiscellaneousStatistics.FriendlyCleanersKilled]: t('miscellaneous.statistics.friendly_cleaners_killed'),
    [MiscellaneousStatistics.FriendlyDamageInflicted]: t('miscellaneous.statistics.friendly_damage_inflicted'),
    [MiscellaneousStatistics.HealingAppliedOther]: t('miscellaneous.statistics.healing_other'),
    [MiscellaneousStatistics.HealingAppliedSelf]: t('miscellaneous.statistics.healing_self'),
    [MiscellaneousStatistics.TimesDiedAsCleaner]: t('miscellaneous.statistics.times_died_as_cleaner'),
    [MiscellaneousStatistics.TimesIncappedAsCleaner]: t('miscellaneous.statistics.times_incapped_as_cleaner'),
    [MiscellaneousStatistics.TreasureDoorsOpened]: t('miscellaneous.statistics.treasures_doors_opened'),
    [MiscellaneousStatistics.HordesTriggered]: t('miscellaneous.statistics.hordes_triggered'),
    [MiscellaneousStatistics.SnitchersSilenced]: t('miscellaneous.statistics.snitchers_silenced'),
  };

  return (
    <div>
      <div>
        <strong className="text-2xl">{t('miscellaneous.title')}</strong>

        <div className="grid grid-cols-12 gap-4 mt-5">
          {Object.keys(miscellaneousGraphs).map((stat) => (
            <div className="col-span-4" key={stat}>
              <Miscellaneous
                miscellaneousStatistic={stat as unknown as MiscellaneousStatistics}
                title={miscellaneousGraphs[stat as unknown as MiscellaneousStatistics]}
              />
            </div>
          ))}
        </div>
      </div>

      <Divider variant="dashed" my={30}/>

      <div>
        <RiddenKilled/>
      </div>

      <Divider variant="dashed" my={30}/>

      <div>
        <RiddenKilledPerWeaponOverall/>
      </div>
    </div>
  );
}