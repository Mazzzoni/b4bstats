import { Table, useMantineTheme } from '@mantine/core';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { formatWithSpaces, getFormattedDate } from '@utils/generic';
import StatisticsState from '@components/self/StatisticsState';
import { MiscellaneousStatistics } from '@components/statistics/types';
import { createRef } from 'react';
import ScreenshotTaker from '@components/common/ScreenshotTaker';

export default function Miscellaneous() {
  const elementToScreenshotRef = createRef<HTMLDivElement>();
  const statistics = useRecoilValue(StatisticsState);
  const theme = useMantineTheme();
  const {t} = useTranslation();

  const stats = [
    {
      statistic: t('miscellaneous.statistics.items_purchased_caravan'),
      value: formatWithSpaces(statistics.miscellaneousStatistics[MiscellaneousStatistics.CaravanItemsPurchased]),
      avg: null,
    },
    {
      statistic: t('miscellaneous.statistics.ammo_dropped'),
      value: formatWithSpaces(statistics.miscellaneousStatistics[MiscellaneousStatistics.AmmoDropped]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.AmmoDropped]),
    },
    {
      statistic: t('miscellaneous.statistics.cards_played'),
      value: formatWithSpaces(statistics.miscellaneousStatistics[MiscellaneousStatistics.CardsPlayed]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.CardsPlayed]),
    },
    {
      statistic: t('miscellaneous.statistics.cleaners_rescued'),
      value: formatWithSpaces(statistics.miscellaneousStatistics[MiscellaneousStatistics.CleanersRescued]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.CleanersRescued]),
    },
    {
      statistic: t('miscellaneous.statistics.cleaners_revived'),
      value: formatWithSpaces(statistics.miscellaneousStatistics[MiscellaneousStatistics.CleanersRevived]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.CleanersRevived]),
    },
    {
      statistic: t('miscellaneous.statistics.friendly_cleaners_killed'),
      value: formatWithSpaces(statistics.miscellaneousStatistics[MiscellaneousStatistics.FriendlyCleanersKilled]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.FriendlyCleanersKilled]),
    },
    {
      statistic: t('miscellaneous.statistics.friendly_damage_inflicted'),
      value: formatWithSpaces(statistics.miscellaneousStatistics[MiscellaneousStatistics.FriendlyDamageInflicted]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.FriendlyDamageInflicted]),
    },
    {
      statistic: t('miscellaneous.statistics.healing_other'),
      value: formatWithSpaces(statistics.miscellaneousStatistics[MiscellaneousStatistics.HealingAppliedOther]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.HealingAppliedOther]),
    },
    {
      statistic: t('miscellaneous.statistics.healing_self'),
      value: formatWithSpaces(statistics.miscellaneousStatistics[MiscellaneousStatistics.HealingAppliedSelf]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.HealingAppliedSelf]),
    },
    {
      statistic: t('miscellaneous.statistics.damage_commons'),
      value: formatWithSpaces(statistics.miscellaneousStatistics[MiscellaneousStatistics.CommonRiddenDamageInflicted]),
      avg: formatWithSpaces(statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.CommonRiddenDamageInflicted], false) as number),
    },
    {
      statistic: t('miscellaneous.statistics.damage_mutations'),
      value: formatWithSpaces(statistics.miscellaneousStatistics[MiscellaneousStatistics.SpecialRiddenDamageInflicted]),
      avg: formatWithSpaces(statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.SpecialRiddenDamageInflicted], false) as number),
    },
    {
      statistic: t('miscellaneous.statistics.damage_ridden_overall'),
      value: formatWithSpaces(statistics.miscellaneousStatistics[MiscellaneousStatistics.EnemyDamageInflicted]),
      avg: formatWithSpaces(statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.EnemyDamageInflicted], false) as number),
    },
    {
      statistic: t('miscellaneous.statistics.damage_weakspot'),
      value: formatWithSpaces(statistics.miscellaneousStatistics[MiscellaneousStatistics.WeakSpotDamageInflicted]),
      avg: formatWithSpaces(statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.WeakSpotDamageInflicted], false) as number),
    },
    {
      statistic: t('miscellaneous.statistics.times_died_as_cleaner'),
      value: formatWithSpaces(statistics.miscellaneousStatistics[MiscellaneousStatistics.TimesDiedAsCleaner]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.TimesDiedAsCleaner]),
    },
    {
      statistic: t('miscellaneous.statistics.times_incapped_as_cleaner'),
      value: formatWithSpaces(statistics.miscellaneousStatistics[MiscellaneousStatistics.TimesIncappedAsCleaner]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.TimesIncappedAsCleaner]),
    },
    {
      statistic: t('miscellaneous.statistics.treasures_doors_opened'),
      value: formatWithSpaces(statistics.miscellaneousStatistics[MiscellaneousStatistics.TreasureDoorsOpened]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.TreasureDoorsOpened]),
    },
    {
      statistic: t('miscellaneous.statistics.hordes_triggered'),
      value: formatWithSpaces(statistics.miscellaneousStatistics[MiscellaneousStatistics.HordesTriggered]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.HordesTriggered]),
    },
    {
      statistic: t('miscellaneous.statistics.snitchers_silenced'),
      value: formatWithSpaces(statistics.miscellaneousStatistics[MiscellaneousStatistics.SnitchersSilenced]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.SnitchersSilenced]),
    },
  ];

  const rows = stats.map((stat) => (
    <tr key={stat.statistic}>
      <td>{stat.statistic}</td>
      <td>{stat.value}</td>
      <td>{stat.avg}</td>
    </tr>
  ));

  return (
    <div ref={elementToScreenshotRef} id="miscellaneous" style={{backgroundColor: theme.colors.dark[8]}}>
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold">Miscellaneous</h2>
        <ScreenshotTaker elementToScreenshotRef={elementToScreenshotRef} filename={`b4bstats_mazz__miscellaneous__${getFormattedDate()}`}/>
      </div>

      <Table
        highlightOnHover
        verticalSpacing="sm"
      >
        <thead>
        <tr>
          <th className="w-1/4">Statistic</th>
          <th>Value</th>
          <th>Average per mission</th>
        </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
}