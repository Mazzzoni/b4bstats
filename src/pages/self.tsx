import Head from 'next/head';
import type { NextPage } from 'next';
import { useAtomValue, useSetAtom } from 'jotai';
import MainLayout from '@components/layouts/MainLayout';
import Statistics from '@components/statistics/Statistics';
import StatisticsState from '@components/self/StatisticsState';
import Introduction from '@components/self/Introduction';
import Display from '@components/self/Display';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const Page: NextPage = () => {
  const stats = useAtomValue(StatisticsState);
  const setStatistics = useSetAtom(StatisticsState);
  const { t } = useTranslation();

  useEffect(() => {
    const data = localStorage.getItem('statsFile');
    if (data) {
      try {
        const rawStats = JSON.parse(data);
        const stats = Statistics.build(rawStats);
        setStatistics(stats);
      } catch (error) {
        toast.error(t('errors.cannot_parse_file'));
      }
    }
  }, [setStatistics, t]);

  return (
    <MainLayout title="Self">
      <Head>
        <meta
          name="description"
          content="Analyze your statistics, check your campaigns and achievements progresses"
        />
      </Head>

      <header className="players-page-heading">
        <div className="players-eyebrow">PRIVATE SAVE ANALYZER</div>
        <p className="text-muted">Analyze your exported save in your browser.</p>
      </header>
      {!stats.hydrated ? <Introduction /> : <Display />}
    </MainLayout>
  );
};

export default Page;
