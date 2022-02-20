import Head from 'next/head';
import type { NextPage } from 'next';
import { useRecoilValue } from 'recoil';
import MainLayout from '@components/layouts/MainLayout';
import PlayersStatisticsState from '@components/compare/PlayersStatisticsState';
import Introduction from '@components/compare/Introduction';
import Display from '@components/compare/Display';

const Page: NextPage = () => {
  const playersStatistics = useRecoilValue(PlayersStatisticsState);

  return (
    <MainLayout title="Compare">
      <Head>
        <meta name="description" content="Compare multiple statistics files"/>
      </Head>

      {playersStatistics.length < 2 ? <Introduction/> : <Display/>}
    </MainLayout>
  );
};

export default Page;
