import type { GetStaticProps, NextPage } from 'next';
import MainLayout from '@components/layouts/MainLayout';
import Head from 'next/head';
import Display from '@components/weapons/Display';
import { getDataFileSync } from '@utils/server-generic';
import { WeaponsProps } from '@components/weapons/types';

const Page: NextPage<WeaponsProps> = (props) => {
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

export const getStaticProps: GetStaticProps<WeaponsProps> = async (context) => {
  // TODO: Preprocess weapons to merge qualities for each

  return {
    props: {
      note: getDataFileSync('weapons/note.md'),
      weapons: JSON.parse(getDataFileSync('weapons/common/weapons.json')),
      // weapons: [JSON.parse(getDataFileSync('weapons/common/weapons.json'))[1]],
      attachments: [],
    },
  };
};

export default Page;