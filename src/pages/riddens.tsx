import type { GetStaticProps, NextPage } from 'next';
import MainLayout from '@components/layouts/MainLayout';
import Head from 'next/head';
import Display from '@components/riddens/Display';
import { RiddenProps } from '@components/riddens/RiddenProps';
import { Difficulties } from '@components/statistics/types';
import { getDataFileSync } from '@utils/server-generic';

const Page: NextPage<RiddenProps> = (props) => {
  return (
    <MainLayout title="Riddens">
      <Head>
        <meta name="description" content="Riddens statistics and information"/>
      </Head>

      <div>
        <Display {...props}/>
      </div>
    </MainLayout>
  );
};

export const getStaticProps: GetStaticProps<RiddenProps> = async (context) => {
  const notes = {
    [Difficulties.Easy]: getDataFileSync('riddens/easy/note.md'),
    [Difficulties.Normal]: getDataFileSync('riddens/normal/note.md'),
    [Difficulties.Hard]: getDataFileSync('riddens/hard/note.md'),
    [Difficulties.NoHope]: getDataFileSync('riddens/nohope/note.md'),
    [Difficulties.Pvp]: getDataFileSync('riddens/pvp/note.md'),
  };

  const riddens = {
    [Difficulties.Easy]: JSON.parse(getDataFileSync('riddens/easy/riddens.json')),
    [Difficulties.Normal]: JSON.parse(getDataFileSync('riddens/normal/riddens.json')),
    [Difficulties.Hard]: JSON.parse(getDataFileSync('riddens/hard/riddens.json')),
    [Difficulties.NoHope]: JSON.parse(getDataFileSync('riddens/nohope/riddens.json')),
    [Difficulties.Pvp]: JSON.parse(getDataFileSync('riddens/pvp/riddens.json')),
  }

  return {
    props: {
      notes,
      riddens,
    },
  };
};

export default Page;