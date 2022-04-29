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
        <div>
          <h2 className="font-bold text-2xl color-primary">B4BSTATS</h2>

          <p className="mt-3">
            <strong>B4BSTATS</strong> is an <a href="https://github.com/Mazzzoni/b4bstats" target="_blank" rel="noreferrer" className="color-primary">open source</a> online tool centered around <a href="https://back4blood.com/" target="_blank" rel="noreferrer" className="color-primary"><strong>Back 4 Blood</strong></a> game.
          </p>

          <p>
            You can use this tool to enhance your game experience, helping you unlock achievements and also comparing your statistics with your friends !
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <h2 className="font-bold text-2xl color-primary mt-5">Self</h2>

            <p className="mt-3">
              <Link href="/self"><a className="color-primary">Self</a></Link> mode allows you to check your overall statistics and see your campaigns progresses (online / offline).
            </p>
          </div>

          <div className="col-span-6">
            <h2 className="font-bold text-2xl color-primary mt-5">Compare</h2>

            <p className="mt-3">
              <Link href="/compare"><a className="color-primary">Compare</a></Link> mode allows you to compare your statistics to other players, up to 4.
            </p>

            <p>
              <i>Tip: you can track your statistics evolution if you make backups of your game statistics file and feed those to the compare mode.</i>
            </p>
          </div>

          <div className="col-span-6">
            <h2 className="font-bold text-2xl color-primary">Riddens</h2>

            <p className="mt-3">
              <Link href="/riddens"><a className="color-primary">Riddens</a></Link> page contains every statistics related to riddens, available per difficulty.
            </p>
          </div>

          <div className="col-span-6">
            <h2 className="font-bold text-2xl color-primary">Weapons</h2>

            <p className="mt-3">
              Weapons page is under development, come back later to see up to date weapons data!
            </p>
          </div>
        </div>

        <p className="mt-8">
          Happy slaying ! <img className="inline" src="/images/yeah.png" alt="yeah" width={25}/>
        </p>
      </div>
    </MainLayout>
  );
};

export default Page;
