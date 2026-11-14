import type Statistics from '@components/statistics/Statistics';
import ProfilePlaystyle from './ProfilePlaystyle';
import { Button, Badge } from '@mantine/core';
import { Copy, Check, RefreshCw } from 'react-feather';
import { useUI } from '@translations/useUI';
import { updated, type Player, type RefreshJob } from '@utils/playerApi';
import { PlayerAvatar } from '../Common';
import type { ProfileRankRequest } from './types';

interface Props {
  player: Player;
  statistics: Statistics | null;
  rank: ProfileRankRequest;
  copied: boolean;
  refreshing: boolean;
  active?: RefreshJob | null;
  status?: RefreshJob['status'];
  share: () => Promise<void>;
  refresh: () => Promise<void>;
}
export default function ProfileHeader({
  player,
  statistics,
  rank,
  copied,
  refreshing,
  active,
  status,
  share,
  refresh,
}: Props) {
  const tr = useUI();
  return (
    <section id="profile-top" className="players-profile-header">
      <div className="players-profile-identity">
        <PlayerAvatar player={player} large />
        <div>
          <div className="players-eyebrow">CLEANER DOSSIER</div>
          <h1>{player.gamertag}</h1>
          <div className="players-profile-badges">
            <span>{player.platforms?.join(' / ').toUpperCase()}</span>
            {rank.data?.data?.rank != null ? (
              <Badge size="xs" color="b4b" variant="light">
                #{rank.data.data.rank.toLocaleString()} Legendary
              </Badge>
            ) : (
              <Badge size="xs" color="gray" variant="outline">
                {rank.loading
                  ? 'Loading rank…'
                  : rank.error
                    ? 'Rank unavailable'
                    : 'Rank unavailable'}
              </Badge>
            )}
          </div>
          <ProfilePlaystyle statistics={statistics} />
        </div>
      </div>
      <div className="ml-auto flex flex-wrap items-start justify-end gap-2 self-start">
        <Button
          variant="default"
          size="xs"
          leftSection={copied ? <Check size={14} /> : <Copy size={14} />}
          onClick={share}
        >
          {tr(copied ? 'Copied' : 'Share profile')}
        </Button>
        <div className="flex flex-col items-end gap-2">
          <Button
            size="xs"
            loading={refreshing || active?.status === 'running'}
            disabled={active?.status === 'queued' || active?.status === 'scheduled'}
            leftSection={<RefreshCw size={14} />}
            onClick={refresh}
          >
            {tr(
              status && ['scheduled', 'queued', 'running'].includes(status)
                ? 'Queued for refresh'
                : 'Request refresh',
            )}
          </Button>
          <p className="profile-last-refreshed text-right text-xs text-muted">
            Last refreshed {updated(player.fetchedAt)}.
          </p>
        </div>
      </div>
    </section>
  );
}
