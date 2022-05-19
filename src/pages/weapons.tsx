import type { GetStaticProps, NextPage } from 'next';
import MainLayout from '@components/layouts/MainLayout';
import Head from 'next/head';
import Display from '@components/weapons/Display';
import { getDataFileSync } from '@utils/server-generic';
import { WeaponsProps } from '@components/weapons/types';

const Page: NextPage<WeaponsProps> = (props) => {
  return (
    <MainLayout title="Weapons">
      <Head>
        <meta name="description" content="Weapons statistics and information"/>
      </Head>

      <div>
        <Display {...props}/>
      </div>

      <div className="text-center italic">
        <a href="https://statty.net/" target="_blank" rel="noreferrer">{`"Knowledge is Power"`}</a>
      </div>
    </MainLayout>
  );
};

export const getStaticProps: GetStaticProps<WeaponsProps> = async (context) => {
  return {
    props: {
      note: getDataFileSync('weapons/note.md'),
      weapons: JSON.parse(getDataFileSync('weapons/weapons.json')),
      attachments: [],
    },
  };
};

export default Page;