import { Table, useMantineTheme } from '@mantine/core';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { localeFormat, getFormattedDate } from '@utils/generic';
import StatisticsState from '@components/self/StatisticsState';
import { BurnCards, MiscellaneousStatistics } from '@components/statistics/types';
import { createRef } from 'react';
import ScreenshotTaker from '@components/common/ScreenshotTaker';
import { burnCardKeyToString } from '@translations/helpers';

export default function Miscellaneous() {
  const elementToScreenshotRef = createRef<HTMLDivElement>();
  const statistics = useRecoilValue(StatisticsState);
  const theme = useMantineTheme();
  const {t} = useTranslation();

  const stats = [
    {
      statistic: t('miscellaneous.statistics.items_purchased_caravan'),
      value: localeFormat(statistics.miscellaneousStatistics[MiscellaneousStatistics.CaravanItemsPurchased]),
      avg: null,
    },
    {
      statistic: t('miscellaneous.statistics.ammo_dropped'),
      value: localeFormat(statistics.miscellaneousStatistics[MiscellaneousStatistics.AmmoDropped]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.AmmoDropped]),
    },
    {
      statistic: t('miscellaneous.statistics.cards_played'),
      value: localeFormat(statistics.miscellaneousStatistics[MiscellaneousStatistics.CardsPlayed]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.CardsPlayed]),
    },
    {
      statistic: t('miscellaneous.statistics.cleaners_rescued'),
      value: localeFormat(statistics.miscellaneousStatistics[MiscellaneousStatistics.CleanersRescued]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.CleanersRescued]),
    },
    {
      statistic: t('miscellaneous.statistics.cleaners_revived'),
      value: localeFormat(statistics.miscellaneousStatistics[MiscellaneousStatistics.CleanersRevived]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.CleanersRevived]),
    },
    {
      statistic: t('miscellaneous.statistics.friendly_cleaners_killed'),
      value: localeFormat(statistics.miscellaneousStatistics[MiscellaneousStatistics.FriendlyCleanersKilled]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.FriendlyCleanersKilled]),
    },
    {
      statistic: t('miscellaneous.statistics.friendly_damage_inflicted'),
      value: localeFormat(statistics.miscellaneousStatistics[MiscellaneousStatistics.FriendlyDamageInflicted]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.FriendlyDamageInflicted]),
    },
    {
      statistic: t('miscellaneous.statistics.healing_other'),
      value: localeFormat(statistics.miscellaneousStatistics[MiscellaneousStatistics.HealingAppliedOther]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.HealingAppliedOther]),
    },
    {
      statistic: t('miscellaneous.statistics.healing_self'),
      value: localeFormat(statistics.miscellaneousStatistics[MiscellaneousStatistics.HealingAppliedSelf]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.HealingAppliedSelf]),
    },
    {
      statistic: t('miscellaneous.statistics.damage_commons'),
      value: localeFormat(statistics.miscellaneousStatistics[MiscellaneousStatistics.CommonRiddenDamageInflicted]),
      avg: localeFormat(statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.CommonRiddenDamageInflicted], false) as number),
    },
    {
      statistic: t('miscellaneous.statistics.damage_mutations'),
      value: localeFormat(statistics.miscellaneousStatistics[MiscellaneousStatistics.SpecialRiddenDamageInflicted]),
      avg: localeFormat(statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.SpecialRiddenDamageInflicted], false) as number),
    },
    {
      statistic: t('miscellaneous.statistics.damage_ridden_overall'),
      value: localeFormat(statistics.miscellaneousStatistics[MiscellaneousStatistics.EnemyDamageInflicted]),
      avg: localeFormat(statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.EnemyDamageInflicted], false) as number),
    },
    {
      statistic: t('miscellaneous.statistics.damage_weakspot'),
      value: localeFormat(statistics.miscellaneousStatistics[MiscellaneousStatistics.WeakSpotDamageInflicted]),
      avg: localeFormat(statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.WeakSpotDamageInflicted], false) as number),
    },
    {
      statistic: t('miscellaneous.statistics.times_died_as_cleaner'),
      value: localeFormat(statistics.miscellaneousStatistics[MiscellaneousStatistics.TimesDiedAsCleaner]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.TimesDiedAsCleaner]),
    },
    {
      statistic: t('miscellaneous.statistics.times_incapped_as_cleaner'),
      value: localeFormat(statistics.miscellaneousStatistics[MiscellaneousStatistics.TimesIncappedAsCleaner]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.TimesIncappedAsCleaner]),
    },
    {
      statistic: t('miscellaneous.statistics.treasures_doors_opened'),
      value: localeFormat(statistics.miscellaneousStatistics[MiscellaneousStatistics.TreasureDoorsOpened]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.TreasureDoorsOpened]),
    },
    {
      statistic: t('miscellaneous.statistics.hordes_triggered'),
      value: localeFormat(statistics.miscellaneousStatistics[MiscellaneousStatistics.HordesTriggered]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.HordesTriggered]),
    },
    {
      statistic: t('miscellaneous.statistics.snitchers_silenced'),
      value: localeFormat(statistics.miscellaneousStatistics[MiscellaneousStatistics.SnitchersSilenced]),
      avg: statistics.getAverageValuePerMissionCompleted(statistics.miscellaneousStatistics[MiscellaneousStatistics.SnitchersSilenced]),
    },
  ];

  return (
    <div ref={elementToScreenshotRef} id="miscellaneous" style={{backgroundColor: theme.colors.dark[8]}}>
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold">Miscellaneous</h2>
        <ScreenshotTaker elementToScreenshotRef={elementToScreenshotRef} filename={`b4bstats_mazz__miscellaneous__${getFormattedDate()}`}/>
      </div>

      <h2 className="text-2xl font-bold mt-5">Statistics</h2>

      <Table
        highlightOnHover
        verticalSpacing="sm"
      >
        <thead>
        <tr>
          <th className="w-72">Statistic</th>
          <th className="w-56">Value</th>
          <th>Average per mission</th>
        </tr>
        </thead>
        <tbody>
        {stats.map((stat) => (
          <tr key={stat.statistic}>
            <td><b>{stat.statistic}</b></td>
            <td>{stat.value}</td>
            <td>{stat.avg || '-'}</td>
          </tr>
        ))}
        </tbody>
      </Table>

      <h2 className="text-2xl font-bold mt-5">Currencies</h2>

      <Table
        highlightOnHover
        verticalSpacing="sm"
      >
        <thead>
        <tr>
          <th className="w-72">Currency</th>
          <th className="w-56">Acquired</th>
          <th className="w-56">Spent</th>
          <th>Balance from inventory</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td><b>Supply Points</b></td>
          <td>{localeFormat(statistics.currencies.supplyPoints.acquired)}</td>
          <td>{localeFormat(statistics.currencies.supplyPoints.spent)}</td>
          <td>{localeFormat(statistics.currencies.supplyPoints.balanceFromInventory)}</td>
        </tr>

        <tr>
          <td><b>Skull Totem Points</b></td>
          <td>{localeFormat(statistics.currencies.skullTotemPoints.acquired)}</td>
          <td>{localeFormat(statistics.currencies.skullTotemPoints.spent)}</td>
          <td>-</td>
        </tr>
        </tbody>
      </Table>

      <h2 className="text-2xl font-bold mt-5">Burn cards</h2>

      <Table
        highlightOnHover
        verticalSpacing="sm"
      >
        <thead>
        <tr>
          <th className="w-72">Card</th>
          <th className="w-56">Acquired</th>
          <th>Spent</th>
        </tr>
        </thead>
        <tbody>
        {Object.keys(statistics.burnCardsStatistics).sort().map((burnCardKey) => (
          <tr key={burnCardKey}>
            <td><b>{burnCardKeyToString(burnCardKey as BurnCards)}</b></td>
            <td>{statistics.burnCardsStatistics[burnCardKey as BurnCards]!.acquired}</td>
            <td>{statistics.burnCardsStatistics[burnCardKey as BurnCards]!.spent}</td>
          </tr>
        ))}
        </tbody>
      </Table>
    </div>
  );
}