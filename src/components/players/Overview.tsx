import { overviewRoutes, type OverviewSection } from '@utils/overviewRoutes';
import { useTranslation } from 'react-i18next';
import { supportMetrics, combatMetrics, isEfficiencyMetric } from '@utils/communityRankings';
import type { WeaponTarget } from '@utils/playerApi';
import { useUI } from '@translations/useUI';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NativeSelect, Button, SegmentedControl, Tabs } from '@mantine/core';
import MainLayout from '@components/layouts/MainLayout';
import PlayerSearch from './PlayerSearch';
import { RankingTable, ErrorState, LoadingState } from './Common';
import { Ranking, Metric, metricLabels, usePlayerApi, type BoardOptions } from '@utils/playerApi';
import OfficialRanking, { type CombinedBoardResponse } from './OfficialRanking';
import OverallStats, { type OverallStatsResponse } from './OverallStats';
export default function Overview({ tab = 'community' }: { tab?: OverviewSection }) {
  const tr = useUI();
  const { t } = useTranslation();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (router.isReady) setReady(true);
  }, [router.isReady]);
  const query = (key: string, fallback: string) =>
    typeof router.query[key] === 'string' ? (router.query[key] as string) : fallback;
  const requestedMetric = query('metric', 'missions');
  const metric: Metric = Object.hasOwn(metricLabels, requestedMetric)
    ? (requestedMetric as Metric)
    : 'missions';
  const order = query('order', 'desc') === 'asc' ? 'asc' : 'desc';
  const requestedPage = Number(query('page', '1'));
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 && requestedPage <= 10000
      ? requestedPage
      : 1;
  const platform = query('platform', 'steamandeos');
  const weapon = query('weapon', 'category:Melee');
  function update(values: Record<string, string | number>) {
    const nextQuery: Record<string, string | string[] | number | undefined> = {
      ...router.query,
      page: 1,
      ...values,
    };
    delete nextQuery.country;
    delete nextQuery.tab;
    if ((values.metric ?? metric) !== 'weaponKills') delete nextQuery.weapon;
    void router.push({ pathname: router.pathname, query: nextQuery }, undefined, {
      shallow: true,
      scroll: false,
    });
  }
  const weaponOptions = usePlayerApi<{ data: WeaponTarget[] }>(
    ready && tab === 'community' && metric === 'weaponKills' ? '/community/weapons' : null,
  );
  const weaponLabel = (target: WeaponTarget) =>
    t(target.translationKey, { defaultValue: target.label });
  const selectedWeapon = weaponOptions.data?.data.find((target) => target.id === weapon);
  const metricOption = (value: Metric) => ({ value, label: tr(metricLabels[value]) });
  const rankingOptions = [
    {
      group: tr('Totals and progression'),
      items: (Object.keys(metricLabels) as Metric[])
        .filter((key) => !isEfficiencyMetric(key) && key !== 'weaponKills')
        .map(metricOption),
    },
    { group: tr('Support efficiency'), items: supportMetrics.map(metricOption) },
    { group: tr('Combat efficiency'), items: combatMetrics.map(metricOption) },
    { group: tr('Weapon specialists'), items: [metricOption('weaponKills')] },
  ];
  const options = usePlayerApi<{ data: BoardOptions }>(
    tab !== 'overall' ? '/leaderboards/options' : null,
  );
  const community = usePlayerApi<{ data: Ranking }>(
    ready && tab === 'community'
      ? '/community/leaderboards?' +
          new URLSearchParams({
            metric,
            order,
            page: String(page),
            count: '20',
            ...(metric === 'weaponKills' ? { weapon } : {}),
          })
      : null,
  );
  const official = usePlayerApi<CombinedBoardResponse>(
    ready && tab === 'official'
      ? '/leaderboards/legendary/combined?' +
          new URLSearchParams({ platform, page: String(page), count: '100' })
      : null,
  );
  const overall = usePlayerApi<OverallStatsResponse>(
    ready && tab === 'overall' ? '/community/stats' : null,
  );
  const preparing = official.data?.data === null;
  useEffect(() => {
    if (!preparing || tab !== 'official') return;
    const timer = window.setTimeout(official.retry, 3000);
    return () => window.clearTimeout(timer);
  }, [preparing, official.data, official.retry, tab]);
  const loading =
    !ready ||
    (tab === 'overall'
      ? overall.loading
      : tab === 'community'
        ? community.loading
        : official.loading || preparing);
  const error =
    tab === 'overall' ? overall.error : tab === 'community' ? community.error : official.error;
  const totalPages = tab === 'community' ? community.data?.data.totalPages : undefined;
  const hasMore =
    tab === 'community' ? !!totalPages && page < totalPages : !!official.data?.data?.hasMore;
  return (
    <MainLayout
      title={tr(
        tab === 'official'
          ? 'Official Legendary'
          : tab === 'overall'
            ? 'Overall stats'
            : 'Community stats',
      )}
    >
      <div className="players-app">
        <PlayerSearch />
        <Tabs
          value={tab}
          onChange={(value) => {
            if (value && value !== tab && Object.hasOwn(overviewRoutes, value)) {
              void router.push(overviewRoutes[value as OverviewSection], undefined, {
                scroll: false,
              });
            }
          }}
          className="mt-7"
        >
          <Tabs.List>
            <Tabs.Tab value="community">{tr('Community stats')}</Tabs.Tab>
            <Tabs.Tab value="official">{tr('Official Legendary')}</Tabs.Tab>
            <Tabs.Tab value="overall">{tr('Overall stats')}</Tabs.Tab>
          </Tabs.List>
        </Tabs>
        <section className="players-panel">
          {tab !== 'overall' && (
            <div className="ranking-controls">
              {tab === 'community' ? (
                <>
                  <NativeSelect
                    className="ranking-metric-field"
                    label={tr('Rank by')}
                    value={metric}
                    onChange={(event) => update({ metric: event.target.value })}
                    data={rankingOptions}
                  />
                  {metric === 'weaponKills' && (
                    <NativeSelect
                      className="ranking-metric-field"
                      label={tr('Weapon / category')}
                      value={weapon}
                      onChange={(event) => update({ weapon: event.target.value })}
                      disabled={weaponOptions.loading}
                      data={
                        weaponOptions.data
                          ? [
                              {
                                group: tr('Weapon types'),
                                items: weaponOptions.data.data
                                  .filter((target) => target.kind === 'category')
                                  .map((target) => ({
                                    value: target.id,
                                    label: weaponLabel(target),
                                  })),
                              },
                              {
                                group: tr('Weapons'),
                                items: weaponOptions.data.data
                                  .filter((target) => target.kind === 'weapon')
                                  .map((target) => ({
                                    value: target.id,
                                    label: weaponLabel(target),
                                  })),
                              },
                            ]
                          : [{ value: weapon, label: tr('Loading weapons…') }]
                      }
                    />
                  )}
                </>
              ) : (
                <>
                  {options.data && options.data.data.platforms.length > 1 && (
                    <SegmentedControl
                      aria-label="Platform"
                      value={platform}
                      onChange={(value) => update({ platform: value })}
                      data={options.data.data.platforms.map((item) => ({
                        value: item.code,
                        label: item.label,
                      }))}
                    />
                  )}
                </>
              )}
              {tab === 'community' &&
                (metric !== 'missions' ||
                  order !== 'desc' ||
                  typeof router.query.name === 'string') && (
                  <Button
                    variant="default"
                    onClick={() =>
                      void router.push({ pathname: '/', query: {} }, undefined, {
                        shallow: true,
                        scroll: false,
                      })
                    }
                  >
                    {tr('Reset filters')}
                  </Button>
                )}
            </div>
          )}
          {tab === 'community' && isEfficiencyMetric(metric) && (
            <p className="px-5 pb-4 text-xs text-muted">
              {tr('Per completed mission. Minimum 50 missions to qualify.')}
              {supportMetrics.includes(metric) &&
                ' ' + tr('Healing counts teammates only, excluding self-healing.')}
            </p>
          )}
          {tab === 'community' && metric === 'weaponKills' && (
            <p className="px-5 pb-4 text-xs text-muted">
              {weaponOptions.error || tr('Ranked by kills with the selected weapon or category.')}
            </p>
          )}
          {tab === 'community' && metric === 'progression' && (
            <p className="px-5 pb-4 text-xs text-muted">
              {tr(
                'Unique map completions for all 12 cleaners, Recruit through Legendary, including Hives. Replays count once.',
              )}
            </p>
          )}
          {loading ? (
            <LoadingState
              label={tab === 'overall' ? tr('Loading overall stats…') : 'Loading rankings…'}
            />
          ) : error ? (
            <ErrorState
              retryOnly
              message={error}
              retry={
                tab === 'overall'
                  ? overall.retry
                  : tab === 'community'
                    ? community.retry
                    : official.retry
              }
            />
          ) : tab === 'overall' && overall.data ? (
            <OverallStats response={overall.data} />
          ) : tab === 'community' && community.data ? (
            <RankingTable
              ranking={community.data.data}
              selected={metric}
              weaponLabel={selectedWeapon ? weaponLabel(selectedWeapon) : undefined}
              order={order}
              onSort={(key) =>
                update({ metric: key, order: key === metric && order === 'desc' ? 'asc' : 'desc' })
              }
            />
          ) : official.data?.data ? (
            <OfficialRanking board={official.data.data} />
          ) : null}
          {tab !== 'overall' && (
            <div className="players-table-footer ranking-pagination">
              <div>
                <button
                  disabled={loading || page <= 1}
                  onClick={() => update({ page: page - 1 })}
                  aria-label="Previous page"
                >
                  ←
                </button>
                <span>
                  Page {page}
                  {totalPages ? ' of ' + totalPages : ''}
                </span>
                <button
                  disabled={loading || !hasMore}
                  onClick={() => update({ page: page + 1 })}
                  aria-label="Next page"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
