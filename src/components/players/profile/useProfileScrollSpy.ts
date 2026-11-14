import { useEffect, useState } from 'react';

/** Follow document sections without changing the URL or interrupting page scrolling. */
export function useProfileScrollSpy(sectionIds: readonly string[]) {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const header = document.querySelector('.mantine-AppShell-header');
      const activationLine = (header?.getBoundingClientRect().bottom ?? 64) + 24;
      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter(
          (element): element is HTMLElement => !!element && element.getClientRects().length > 0,
        );
      let current = '';
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= activationLine) current = section.id;
      }
      const atBottom =
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      if (atBottom && sections.length) current = sections[sections.length - 1].id;
      setActiveSection(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const content = document.querySelector('.players-app');
    const resize = new ResizeObserver(schedule);
    const mutations = new MutationObserver(schedule);
    if (content) {
      resize.observe(content);
      mutations.observe(content, { childList: true, subtree: true });
    }
    schedule();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      resize.disconnect();
      mutations.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [sectionIds]);

  return activeSection;
}
