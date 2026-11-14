export function publicApiError(status: number, receivedCode: unknown) {
  const messages: Record<string, string> = {
    PLAYER_NOT_FOUND: 'No player matches this complete gamertag.',
    PROFILE_PENDING: 'This profile is waiting to be collected.',
    STATS_UNAVAILABLE: 'No statistics are available for this profile.',
    RATE_LIMITED: 'Too many requests. Please try again later.',
    SERVICE_BUSY: 'The service is busy. Please try again later.',
    SERVICE_UNAVAILABLE: 'The player service is temporarily unavailable.',
    LEADERBOARD_UNAVAILABLE: 'The leaderboard is temporarily unavailable.',
    INVALID_REQUEST: 'Invalid request.',
    NOT_FOUND: 'Not found.',
  };
  const received = typeof receivedCode === 'string' ? receivedCode : '';
  const code =
    status === 429
      ? 'RATE_LIMITED'
      : status >= 500 && !['SERVICE_BUSY', 'LEADERBOARD_UNAVAILABLE'].includes(received)
        ? 'SERVICE_UNAVAILABLE'
        : Object.hasOwn(messages, received)
          ? received
          : 'REQUEST_FAILED';
  return { code, message: messages[code] ?? 'Could not load player data.' };
}
