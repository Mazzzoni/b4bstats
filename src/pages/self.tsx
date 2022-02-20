import Head from 'next/head';
import type { NextPage } from 'next';
import { useRecoilValue } from 'recoil';
import MainLayout from '@components/layouts/MainLayout';
import StatisticsState from '@components/self/StatisticsState';
import Introduction from '@components/self/Introduction';
import Display from '@components/self/Display';

const Page: NextPage = () => {
  const stats = useRecoilValue(StatisticsState);

  return (
    <MainLayout title="Self">
      <Head>
        <meta name="description" content="Analyze your statistics, check your campaigns and achievements progresses"/>
      </Head>

      {!stats.hydrated ? <Introduction/> : <Display/>}
    </MainLayout>
  );
};

export default Page;
