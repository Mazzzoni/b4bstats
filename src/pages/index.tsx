import type { NextPage } from 'next';
import MainLayout from '@components/layouts/MainLayout';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import Link from 'next/link';

const Page: NextPage = () => {
  const {t} = useTranslation();

  return (
    <MainLayout title="Home">
      <Head>
        <title>{t('page_title')}</title>
        <meta name="description" content={t('page_description')}/>
      </Head>

      <div>
        <p>
          <strong>B4BSTATS</strong> is an online tool centered around <strong>Back 4 Blood</strong> game to track your progress through campaigns and display your statistics.
        </p>

        <p className="mt-3">
          Currently, two modes are available: <Link href="/self"><a className="color-primary">Self</a></Link> and <Link href="/compare"><a className="color-primary">Compare</a></Link>.
        </p>

        <p className="mt-3">
          You can use this tool to enhance your game experience, helping you unlock achievements and also comparing your statistics with your friends !
          <br/>
          <i>Tip: you can track your statistics evolution if you make backups of your game statistics file and feed those to the compare mode.</i>
        </p>

        <p className="mt-3">
          Happy slaying ! <img className="inline" src="/images/yeah.png" alt="yeah" width={25}/>
        </p>
      </div>
    </MainLayout>
  );
};

export default Page;
