import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft } from 'react-feather';
import { useUI } from '@translations/useUI';
import MainLayout from '@components/layouts/MainLayout';
import Statistics from '@components/statistics/Statistics';
import { MetricCards, ErrorState, LoadingState } from '@components/players/Common';
import ProfileHeader from '@components/players/profile/ProfileHeader';
import ProfileSidebar from '@components/players/profile/ProfileSidebar';
import ProfileStatistics from '@components/players/profile/ProfileStatistics';
import ProfileProgression from '@components/players/profile/ProfileProgression';
import { useProfileNavigation } from '@components/players/profile/useProfileNavigation';
import { useProfileRefresh } from '@components/players/profile/useProfileRefresh';
import {
  type Player,
  type PlayerStatsData,
  type ProfileRankResponse,
  type RefreshJob,
  asAnalyzerSave,
  usePlayerApi,
} from '@utils/playerApi';

export default function Profile() {
  const tr = useUI();
  const router = useRouter();
  const tag = typeof router.query.gamertag === 'string' ? router.query.gamertag : '';
  const valid = /^.+#[0-9]{3,8}$/.test(tag);
  const path = '/players/' + encodeURIComponent(tag);
  const summary = usePlayerApi<{ data: Player | null; refresh?: RefreshJob }>(
    router.isReady && valid ? path : null,
  );
  const rank = usePlayerApi<ProfileRankResponse>(
    router.isReady && valid ? path + '/rank/combined' : null,
  );
  useEffect(() => {
    if (rank.data?.data !== null) return;
    const timer = window.setTimeout(rank.retry, 3000);
    return () => window.clearTimeout(timer);
  }, [rank.data, rank.retry]);
  const player = summary.data?.data;
  const stats = usePlayerApi<{ data: PlayerStatsData }>(player ? path + '/stats' : null);
  const statistics = useMemo(
    () => (stats.data ? Statistics.build(asAnalyzerSave(stats.data.data)) : null),
    [stats.data],
  );
  const { showStats, setShowStats, showProgression, setShowProgression, jump } =
    useProfileNavigation({ tag, valid, statistics });
  const { active, status, message, setMessage, refreshing, refresh } = useProfileRefresh({
    tag,
    path,
    initialJob: summary.data?.refresh ?? player?.refresh.job,
    retrySummary: summary.retry,
    retryStats: stats.retry,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => setCopied(false), [tag]);
  const shortcuts = player ? <ProfileSidebar onJump={jump} /> : null;

  async function share() {
    try {
      const locale = router.locale === 'default' ? 'en' : (router.locale ?? 'en');
      const gamertag = encodeURIComponent(player!.gamertag).replace(/%23/gi, '#');
      const url = `${window.location.origin}/${locale}/player/${gamertag}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setMessage('Copy the address bar URL to share this profile.');
    }
  }

  return (
    <MainLayout title={player?.gamertag ?? 'Player profile'} sidebar={shortcuts}>
      <div className="players-app">
        <Link href="/" className="players-back">
          <ArrowLeft size={15} /> {tr('Back to overview')}
        </Link>
        {!router.isReady || summary.loading ? (
          <LoadingState />
        ) : !valid ? (
          <ErrorState message="Choose a complete gamertag, including its # digits." />
        ) : summary.error ? (
          <ErrorState message={summary.error} retry={summary.retry} />
        ) : !player ? (
          <div className="players-panel p-7">
            <LoadingState label="Loading profile…" />
          </div>
        ) : (
          <>
            <ProfileHeader
              player={player}
              statistics={statistics}
              rank={rank}
              copied={copied}
              refreshing={refreshing}
              active={active}
              status={status}
              share={share}
              refresh={refresh}
            />
            {message && (!status || !['queued', 'scheduled', 'running'].includes(status)) && (
              <div role="status" className="players-notice">
                {message}
              </div>
            )}
            <MetricCards player={player} />
            <div className="players-profile-actions">
              <Link
                href={'/compare?with=' + encodeURIComponent(player.gamertag)}
                className="players-link"
              >
                Compare with another cleaner →
              </Link>
            </div>
            <ProfileStatistics
              stats={stats}
              statistics={statistics}
              showStats={showStats}
              setShowStats={setShowStats}
            />
            <ProfileProgression
              stats={stats}
              statistics={statistics}
              showProgression={showProgression}
              setShowProgression={setShowProgression}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
}
