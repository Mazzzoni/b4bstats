import type { Metric } from './playerApi';

export const supportMetrics: Metric[] = ['healingOthersPerMission', 'revivesPerMission'];
export const combatMetrics: Metric[] = ['killsPerMission', 'damagePerMission'];
export const isEfficiencyMetric = (metric: Metric) =>
  supportMetrics.includes(metric) || combatMetrics.includes(metric);

export function rankingColumns(selected: Metric): Metric[] {
  if (supportMetrics.includes(selected))
    return [...new Set([selected, ...supportMetrics, 'missions'] as Metric[])];
  if (combatMetrics.includes(selected))
    return [...new Set([selected, ...combatMetrics, 'missions'] as Metric[])];
  if (selected === 'weaponKills') return [selected, 'kills', 'missions'];
  return [...new Set([selected, 'kills', 'damage', 'missions'] as Metric[])];
}
