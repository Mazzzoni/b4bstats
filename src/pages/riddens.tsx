import type { GetStaticProps, NextPage } from 'next';
import MainLayout from '@components/layouts/MainLayout';
import Head from 'next/head';
import Display from '@components/riddens/Display';
import { RiddensProps } from '@components/riddens/types';
import { Difficulties } from '@components/statistics/types';
import { getDataFileSync } from '@utils/server-generic';

const Page: NextPage<RiddensProps> = (props) => {
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

export const getStaticProps: GetStaticProps<RiddensProps> = async (context) => {
  const notes = {
    [Difficulties.Recruit]: getDataFileSync('riddens/recruit/note.md'),
    [Difficulties.Veteran]: getDataFileSync('riddens/veteran/note.md'),
    [Difficulties.Nightmare]: getDataFileSync('riddens/nightmare/note.md'),
    [Difficulties.NoHope]: getDataFileSync('riddens/nohope/note.md'),
    [Difficulties.Swarm]: getDataFileSync('riddens/swarm/note.md'),
  };

  const riddens = {
    [Difficulties.Recruit]: JSON.parse(getDataFileSync('riddens/recruit/riddens.json')),
    [Difficulties.Veteran]: JSON.parse(getDataFileSync('riddens/veteran/riddens.json')),
    [Difficulties.Nightmare]: JSON.parse(getDataFileSync('riddens/nightmare/riddens.json')),
    [Difficulties.NoHope]: JSON.parse(getDataFileSync('riddens/nohope/riddens.json')),
    [Difficulties.Swarm]: JSON.parse(getDataFileSync('riddens/swarm/riddens.json')),
  };

  return {
    props: {
      notes,
      riddens,
    },
  };
};

export default Page;