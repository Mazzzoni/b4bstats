import { useTranslation } from 'react-i18next';
import type Statistics from '@components/statistics/Statistics';
import { getPlaystyle } from '@utils/playstyle';
import { number } from '@utils/playerApi';
import { weaponToString, weaponTypeToString } from '@translations/helpers';

export default function ProfilePlaystyle({ statistics }: { statistics: Statistics | null }) {
  const { t } = useTranslation();
  if (!statistics) return null;
  const { cleaner, weapon } = getPlaystyle(statistics);
  if (!cleaner && !weapon) return null;
  return (
    <dl className="profile-playstyle mt-4 flex flex-wrap gap-x-7 gap-y-3 text-sm">
      {cleaner && (
        <div>
          <dt className="text-xs text-muted">Most played cleaner</dt>
          <dd className="mt-1 font-semibold">{t(`cleaners.${cleaner.id}`)}</dd>
          <dd className="text-xs text-muted">
            {number(cleaner.total)} missions · {Math.round(cleaner.share * 100)}%
          </dd>
        </div>
      )}
      {weapon && (
        <div>
          <dt className="text-xs text-muted">
            {weapon.kind === 'weapon' ? 'Top weapon' : 'Top weapon type'}
          </dt>
          <dd className="mt-1 font-semibold">
            {weapon.kind === 'weapon'
              ? t(`weapons.${weaponToString(weapon.id)}`)
              : t(`weapons_types.${weaponTypeToString(weapon.id)}`)}
          </dd>
          <dd className="text-xs text-muted">
            {number(weapon.total)} kills · {Math.round(weapon.share * 100)}%
          </dd>
        </div>
      )}
    </dl>
  );
}
