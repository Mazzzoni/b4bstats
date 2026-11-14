import { useEffect, useState } from 'react';
import { playerApi, updated, type RefreshJob } from '@utils/playerApi';

interface Options {
  tag: string;
  path: string;
  initialJob?: RefreshJob | null;
  retrySummary: () => void;
  retryStats: () => void;
}
function refreshMessage(job: RefreshJob): string {
  switch (job.status) {
    case 'cooldown':
      return `You can request another refresh after ${updated(new Date(job.eligibleAt!).toISOString())}.`;
    case 'scheduled':
      return `Refresh scheduled after ${updated(new Date(job.eligibleAt!).toISOString())}.`;
    case 'completed':
      return 'Profile refreshed.';
    case 'retry_later':
      return `Please retry after ${updated(new Date(job.retryAt!).toISOString())}.`;
    case 'failed':
      return 'Refresh failed. Your saved profile remains available.';
    default:
      return 'Refresh queued.';
  }
}

export function useProfileRefresh({ tag, path, initialJob, retrySummary, retryStats }: Options) {
  const [job, setJob] = useState<RefreshJob | null>(null);
  const [message, setMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const active = job ?? initialJob;
  const status = active?.status;

  useEffect(() => {
    setJob(null);
    setMessage('');
  }, [tag]);

  useEffect(() => {
    if (!status || !['queued', 'running'].includes(status)) return;
    const controller = new AbortController();
    const timer = setInterval(() => {
      playerApi<{ data: RefreshJob | null }>(path + '/refresh', controller.signal)
        .then((response) => {
          if (controller.signal.aborted || !response.data) return;
          setJob(response.data);
          if (response.data.status === 'completed') {
            clearInterval(timer);
            setMessage('Profile refreshed.');
            retrySummary();
            retryStats();
          }
          if (response.data.status === 'failed') {
            clearInterval(timer);
            setMessage('The refresh failed. Your previous snapshot is still available.');
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            clearInterval(timer);
            setMessage('Could not check the refresh queue. Reload to check your profile.');
          }
        });
    }, 3000);
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, [status, path, retrySummary, retryStats]);

  async function refresh() {
    setRefreshing(true);
    try {
      const response = await playerApi<{ data: RefreshJob }>(path + '/refresh', undefined, 'POST');
      setJob(response.data);
      setMessage(refreshMessage(response.data));
      if (response.data.status === 'completed') {
        retrySummary();
        retryStats();
      }
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setRefreshing(false);
    }
  }

  return { active, status, message, setMessage, refreshing, refresh };
}
