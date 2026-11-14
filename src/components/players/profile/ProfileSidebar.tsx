import { useEffect, useRef } from 'react';
import { useProfileScrollSpy } from './useProfileScrollSpy';
import { useUI } from '@translations/useUI';
import { useTranslation } from 'react-i18next';
import { currentCleanerOrder, getCleanerIdsByNames, getCleanerNameById } from '@utils/generic';

const cleanerIds = getCleanerIdsByNames(currentCleanerOrder);
const sectionIds = [
  'profile-statistics',
  'miscellaneous',
  'graphs',
  'profile-progression',
  ...cleanerIds.map((id) => getCleanerNameById(id).toLowerCase()),
  'achievements',
];

interface Props {
  onJump: (id: string, progression?: boolean) => void;
}
export default function ProfileSidebar({ onJump }: Props) {
  const tr = useUI();
  const { t } = useTranslation();
  const sidebar = useRef<HTMLElement>(null);
  const activeSection = useProfileScrollSpy(sectionIds);
  const current = (id: string) => (activeSection === id ? ('location' as const) : undefined);

  useEffect(() => {
    const viewport = sidebar.current?.closest<HTMLElement>('.mantine-ScrollArea-viewport');
    if (!viewport) return;
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'instant'
      : 'smooth';
    if (!activeSection) {
      viewport.scrollTo({ top: 0, behavior });
      return;
    }
    const link = sidebar.current?.querySelector<HTMLElement>('a[aria-current="location"]');
    if (!link) return;
    const item = link.getBoundingClientRect();
    const bounds = viewport.getBoundingClientRect();
    if (item.top < bounds.top + 12 || item.bottom > bounds.bottom - 12) {
      // Scroll only the sidebar viewport; scrollIntoView would also move the document.
      viewport.scrollTo({
        top: viewport.scrollTop + item.top - bounds.top - (bounds.height - item.height) / 2,
        behavior,
      });
    }
  }, [activeSection]);
  return (
    <aside ref={sidebar} className="profile-shortcuts" aria-label="Player sections">
      <strong className="px-3 text-xs uppercase tracking-wide text-muted">
        {tr('Statistics')}
      </strong>
      <a
        href="#profile-statistics"
        aria-current={current('profile-statistics')}
        onClick={(event) => {
          event.preventDefault();
          onJump('profile-statistics');
        }}
      >
        {tr('Detailed statistics')}
      </a>
      <a
        href="#miscellaneous"
        aria-current={current('miscellaneous')}
        onClick={(event) => {
          event.preventDefault();
          onJump('miscellaneous');
        }}
      >
        {t('miscellaneous.title')}
      </a>
      <a
        href="#graphs"
        aria-current={current('graphs')}
        onClick={(event) => {
          event.preventDefault();
          onJump('graphs');
        }}
      >
        {t('graphs.title')}
      </a>
      <strong className="mt-5 block px-3 text-xs uppercase tracking-wide text-muted">
        {tr('Progression')}
      </strong>
      <a
        href="#profile-progression"
        aria-current={current('profile-progression')}
        onClick={(event) => {
          event.preventDefault();
          onJump('profile-progression', true);
        }}
      >
        {tr('Detailed progression')}
      </a>
      {cleanerIds.map((id) => (
        <a
          key={id}
          href={'#' + getCleanerNameById(id).toLowerCase()}
          aria-current={current(getCleanerNameById(id).toLowerCase())}
          onClick={(event) => {
            event.preventDefault();
            onJump(getCleanerNameById(id).toLowerCase(), true);
          }}
        >
          <img
            src={'/images/cleaners/' + getCleanerNameById(id).toLowerCase() + '.webp'}
            alt=""
            className="h-9 w-9 object-contain"
          />
          {t('cleaners.' + id)}
        </a>
      ))}
      <a
        href="#achievements"
        aria-current={current('achievements')}
        onClick={(event) => {
          event.preventDefault();
          onJump('achievements', true);
        }}
      >
        {t('achievements.title')}
      </a>
    </aside>
  );
}
