import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type Statistics from '@components/statistics/Statistics';

interface Options {
  tag: string;
  valid: boolean;
  statistics: Statistics | null;
}
export function useProfileNavigation({ tag, valid, statistics }: Options) {
  const router = useRouter();
  const [showStats, setShowStats] = useState(true);
  const [showProgression, setShowProgression] = useState(false);
  const [anchor, setAnchor] = useState('');

  function jump(id: string, progression = false) {
    if (progression) setShowProgression(true);
    else setShowStats(true);
    setAnchor(id);
    void router.replace({ pathname: router.pathname, query: router.query, hash: id }, undefined, {
      shallow: true,
      scroll: false,
    });
  }
  useEffect(() => {
    if (!anchor) return;
    let frame = 0,
      attempt = 0;
    const scroll = () => {
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'instant'
            : 'smooth',
          block: 'start',
        });
        setAnchor('');
      } else if (++attempt < 60) frame = requestAnimationFrame(scroll);
    };
    frame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(frame);
  }, [anchor, statistics, showStats, showProgression]);

  useEffect(() => {
    if (!valid) return;
    const id = window.location.hash.slice(1);
    if (['miscellaneous', 'graphs', 'profile-statistics'].includes(id)) {
      setShowStats(true);
      setAnchor(id);
    } else if (id && id !== 'profile-top') {
      setShowProgression(true);
      setAnchor(id);
    }
  }, [valid, tag]);

  useEffect(() => {
    if (router.isReady && !valid && tag && /^#[0-9]{3,8}$/.test(window.location.hash))
      void router.replace('/player/' + encodeURIComponent(tag + window.location.hash));
  }, [router.isReady, valid, tag, router]);
  return { showStats, setShowStats, showProgression, setShowProgression, jump };
}
