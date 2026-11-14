import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import OnlineComparison from '@components/players/OnlineComparison';
import type { NextPage } from 'next';
import { useAtomValue } from 'jotai';
import MainLayout from '@components/layouts/MainLayout';
import PlayersStatisticsState from '@components/compare/PlayersStatisticsState';
import Introduction from '@components/compare/Introduction';
import Display from '@components/compare/Display';

const Page: NextPage = () => {
  const [mode, setMode] = useState('online');
  const resultsRef = useRef<HTMLDivElement>(null);
  const playersStatistics = useAtomValue(PlayersStatisticsState);

  useEffect(() => {
    if (mode !== 'files' || playersStatistics.length < 2) return;
    const frame = requestAnimationFrame(() =>
      resultsRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
        block: 'start',
      }),
    );
    return () => cancelAnimationFrame(frame);
  }, [mode, playersStatistics]);
  return (
    <MainLayout title="Compare">
      <Head>
        <meta name="description" content="Compare multiple statistics files" />
      </Head>

      <div className="players-app">
        <div className="players-page-heading">
          <div className="players-eyebrow">THE SQUAD, SIDE BY SIDE</div>
          <h1>Compare your cleaners.</h1>
          <p>Bring up to four profiles into the same view.</p>
        </div>
        <div className="players-tabs" role="tablist" aria-label="Comparison source">
          <button role="tab" aria-selected={mode === 'online'} onClick={() => setMode('online')}>
            Online profiles
          </button>
          <button role="tab" aria-selected={mode === 'files'} onClick={() => setMode('files')}>
            Save files
          </button>
        </div>
      </div>
      {mode === 'online' ? (
        <OnlineComparison />
      ) : (
        <div className="mt-6">
          {playersStatistics.length < 2 ? (
            <Introduction />
          ) : (
            <div id="comparison-results" ref={resultsRef}>
              <Display />
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
};

export default Page;
