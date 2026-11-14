import { Table, useMantineTheme } from '@mantine/core';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import { localeFormat } from '@utils/generic';
import StatisticsState from '@components/self/StatisticsState';
import { BurnCards, MiscellaneousStatistics } from '@components/statistics/types';
import { burnCardKeyToString } from '@translations/helpers';

export default function Miscellaneous() {
  const statistics = useAtomValue(StatisticsState);
  const theme = useMantineTheme();
  const { t } = useTranslation();

  const stats = [
    {
      statistic: t('miscellaneous.statistics.items_purchased_caravan'),
      value: localeFormat(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.CaravanItemsPurchased],
      ),
      avg: null,
    },
    {
      statistic: t('miscellaneous.statistics.ammo_dropped'),
      value: localeFormat(statistics.miscellaneousStatistics[MiscellaneousStatistics.AmmoDropped]),
      avg: statistics.getAverageValuePerMissionCompleted(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.AmmoDropped],
      ),
    },
    {
      statistic: t('miscellaneous.statistics.cards_played'),
      value: localeFormat(statistics.miscellaneousStatistics[MiscellaneousStatistics.CardsPlayed]),
      avg: statistics.getAverageValuePerMissionCompleted(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.CardsPlayed],
      ),
    },
    {
      statistic: t('miscellaneous.statistics.cleaners_rescued'),
      value: localeFormat(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.CleanersRescued],
      ),
      avg: statistics.getAverageValuePerMissionCompleted(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.CleanersRescued],
      ),
    },
    {
      statistic: t('miscellaneous.statistics.cleaners_revived'),
      value: localeFormat(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.CleanersRevived],
      ),
      avg: statistics.getAverageValuePerMissionCompleted(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.CleanersRevived],
      ),
    },
    {
      statistic: t('miscellaneous.statistics.friendly_cleaners_killed'),
      value: localeFormat(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.FriendlyCleanersKilled],
      ),
      avg: statistics.getAverageValuePerMissionCompleted(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.FriendlyCleanersKilled],
      ),
    },
    {
      statistic: t('miscellaneous.statistics.friendly_damage_inflicted'),
      value: localeFormat(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.FriendlyDamageInflicted],
      ),
      avg: statistics.getAverageValuePerMissionCompleted(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.FriendlyDamageInflicted],
      ),
    },
    {
      statistic: t('miscellaneous.statistics.healing_other'),
      value: localeFormat(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.HealingAppliedOther],
      ),
      avg: statistics.getAverageValuePerMissionCompleted(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.HealingAppliedOther],
      ),
    },
    {
      statistic: t('miscellaneous.statistics.healing_self'),
      value: localeFormat(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.HealingAppliedSelf],
      ),
      avg: statistics.getAverageValuePerMissionCompleted(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.HealingAppliedSelf],
      ),
    },
    {
      statistic: t('miscellaneous.statistics.damage_commons'),
      value: localeFormat(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.CommonRiddenDamageInflicted],
      ),
      avg: localeFormat(
        statistics.getAverageValuePerMissionCompleted(
          statistics.miscellaneousStatistics[MiscellaneousStatistics.CommonRiddenDamageInflicted],
          false,
        ) as number,
      ),
    },
    {
      statistic: t('miscellaneous.statistics.damage_mutations'),
      value: localeFormat(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.SpecialRiddenDamageInflicted],
      ),
      avg: localeFormat(
        statistics.getAverageValuePerMissionCompleted(
          statistics.miscellaneousStatistics[MiscellaneousStatistics.SpecialRiddenDamageInflicted],
          false,
        ) as number,
      ),
    },
    {
      statistic: t('miscellaneous.statistics.damage_ridden_overall'),
      value: localeFormat(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.EnemyDamageInflicted],
      ),
      avg: localeFormat(
        statistics.getAverageValuePerMissionCompleted(
          statistics.miscellaneousStatistics[MiscellaneousStatistics.EnemyDamageInflicted],
          false,
        ) as number,
      ),
    },
    {
      statistic: t('miscellaneous.statistics.damage_weakspot'),
      value: localeFormat(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.WeakSpotDamageInflicted],
      ),
      avg: localeFormat(
        statistics.getAverageValuePerMissionCompleted(
          statistics.miscellaneousStatistics[MiscellaneousStatistics.WeakSpotDamageInflicted],
          false,
        ) as number,
      ),
    },
    {
      statistic: t('miscellaneous.statistics.times_died_as_cleaner'),
      value: localeFormat(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.TimesDiedAsCleaner],
      ),
      avg: statistics.getAverageValuePerMissionCompleted(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.TimesDiedAsCleaner],
      ),
    },
    {
      statistic: t('miscellaneous.statistics.times_incapped_as_cleaner'),
      value: localeFormat(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.TimesIncappedAsCleaner],
      ),
      avg: statistics.getAverageValuePerMissionCompleted(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.TimesIncappedAsCleaner],
      ),
    },
    {
      statistic: t('miscellaneous.statistics.treasures_doors_opened'),
      value: localeFormat(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.TreasureDoorsOpened],
      ),
      avg: statistics.getAverageValuePerMissionCompleted(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.TreasureDoorsOpened],
      ),
    },
    {
      statistic: t('miscellaneous.statistics.hordes_triggered'),
      value: localeFormat(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.HordesTriggered],
      ),
      avg: statistics.getAverageValuePerMissionCompleted(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.HordesTriggered],
      ),
    },
    {
      statistic: t('miscellaneous.statistics.snitchers_silenced'),
      value: localeFormat(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.SnitchersSilenced],
      ),
      avg: statistics.getAverageValuePerMissionCompleted(
        statistics.miscellaneousStatistics[MiscellaneousStatistics.SnitchersSilenced],
      ),
    },
  ];

  const formatCounter = (value: number | null) => (value === null ? '—' : localeFormat(value));
  const currencyRows = [
    { name: 'Supply Points', ...statistics.currencies.supplyPoints },
    {
      name: 'Skull Totem Points',
      ...statistics.currencies.skullTotemPoints,
      balanceFromInventory: null,
    },
  ].filter(
    (row) => row.acquired !== null || row.spent !== null || row.balanceFromInventory !== null,
  );
  const showBalance = currencyRows.some((row) => row.balanceFromInventory !== null);
  const cards = Object.keys(statistics.burnCardsStatistics).sort() as BurnCards[];
  return (
    <div id="miscellaneous" style={{ backgroundColor: theme.colors.dark[7] }}>
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold">{t('miscellaneous.title')}</h2>
      </div>

      <h2 className="text-2xl font-bold mt-5">Statistics</h2>

      <Table.ScrollContainer minWidth={520}>
        <Table className="stats-table" striped highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="w-72">{t('miscellaneous.statistic_label')}</Table.Th>
              <Table.Th className="w-56">{t('miscellaneous.value_label')}</Table.Th>
              <Table.Th>Average per mission</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {stats.map((stat) => (
              <Table.Tr key={stat.statistic}>
                <Table.Td>
                  <b>{stat.statistic}</b>
                </Table.Td>
                <Table.Td>{stat.value}</Table.Td>
                <Table.Td>{stat.avg ?? '—'}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {currencyRows.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-5">Currencies</h2>
          <Table.ScrollContainer minWidth={520}>
            <Table className="stats-table" striped highlightOnHover verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Currency</Table.Th>
                  <Table.Th>Acquired</Table.Th>
                  <Table.Th>Spent</Table.Th>
                  {showBalance && <Table.Th>Balance</Table.Th>}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {currencyRows.map((row) => (
                  <Table.Tr key={row.name}>
                    <Table.Td>
                      <b>{row.name}</b>
                    </Table.Td>
                    <Table.Td>{formatCounter(row.acquired)}</Table.Td>
                    <Table.Td>{formatCounter(row.spent)}</Table.Td>
                    {showBalance && <Table.Td>{formatCounter(row.balanceFromInventory)}</Table.Td>}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </>
      )}
      {cards.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-5">Burn cards</h2>
          <Table.ScrollContainer minWidth={520}>
            <Table className="stats-table" striped highlightOnHover verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Card</Table.Th>
                  <Table.Th>Acquired</Table.Th>
                  <Table.Th>Spent</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {cards.map((key) => (
                  <Table.Tr key={key}>
                    <Table.Td>
                      <b>
                        {burnCardKeyToString(key) === 'Unknown Card'
                          ? key
                          : burnCardKeyToString(key)}
                      </b>
                    </Table.Td>
                    <Table.Td>
                      {formatCounter(statistics.burnCardsStatistics[key]!.acquired)}
                    </Table.Td>
                    <Table.Td>{formatCounter(statistics.burnCardsStatistics[key]!.spent)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </>
      )}
    </div>
  );
}
