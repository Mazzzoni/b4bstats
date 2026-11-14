import type { PlayerStatsData, ProfileRankResponse, usePlayerApi } from '@utils/playerApi';

export type ProfileStatsRequest = ReturnType<typeof usePlayerApi<{ data: PlayerStatsData }>>;

export type ProfileRankRequest = ReturnType<typeof usePlayerApi<ProfileRankResponse>>;
