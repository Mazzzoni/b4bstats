import { ChartType, TooltipItem } from 'chart.js';
import { localeFormat } from '@utils/generic';
import { translateKillsTooltip, translateMissionsTooltip } from '@translations/helpers';
import { Weapons } from '@components/statistics/types';

export function tooltipCallbackLabelPlain(context: TooltipItem<ChartType>, overallValue: number): string {
  const value = context.raw as number;
  const percent = Math.round(value / overallValue * 100);

  return `${localeFormat(value)} (${percent}%)`;
}

export function tooltipCallbackLabelKills(context: TooltipItem<ChartType>, overallValue: number, t: Function): string {
  const value = context.raw as number;
  const percent = Math.round(value / overallValue * 100);

  return translateKillsTooltip(t, value, percent);
}

export function tooltipCallbackLabelMissions(context: TooltipItem<ChartType>, overallValue: number, t: Function): string {
  const value = context.raw as number;
  const percent = Math.round(value / overallValue * 100);

  return translateMissionsTooltip(t, value, percent);
}

export function isSkippableWeaponInOverall(weapon: Weapons): boolean {
  return weapon === Weapons.Fist
    || weapon === Weapons.BobArm
    || weapon === Weapons.SkullTotem
    || weapon === Weapons.Bow;
}