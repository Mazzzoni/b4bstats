import type { NextPage } from 'next';
import Head from 'next/head';
import MainLayout from '@components/layouts/MainLayout';
import { Divider, Kbd } from '@mantine/core';

type ContributorProps = {
  name: string
  contribution: string
  discord?: boolean
  reddit?: boolean
}

function Contributor({name, contribution, discord = false, reddit = false}: ContributorProps)
{
  let icon = null;

  if (discord) {
    icon = <img src="/images/discord.svg" className="w-4 inline relative top-[-2px]" alt="discord"/>;
  }

  if (reddit) {
    icon = <img src="/images/reddit.svg" className="w-4 inline relative top-[-2px]" alt="reddit"/>;
  }

  let color = '';

  if (discord) {
    color = '#7289DA';
  } else if (reddit) {
    color = '#FF4500';
  }

  return <p className="">
    {icon} <b style={{color: color}}>{name}</b> for {contribution} <img src="/images/docheart.png" className="w-6 inline" alt="Doc Heart"/>
  </p>;
}

const Page: NextPage = () => {
  return (
    <MainLayout title="About">
      <Head>
        <meta name="description" content="B4BSTATS is a community tools centered around Back 4 Blood game, learn more about it, how to participate and frequently asked questions."/>
      </Head>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-5">
          <div>
            <h3 className="text-2xl font-bold">About</h3>

            <p className="mt-3">
              <strong>B4BSTATS</strong> is a community tool centered around <strong>Back 4 Blood</strong> game, if you want to participate by translating into new languages, or giving feedback about it, please do !
            </p>

            <p className="mt-3">
              <i>Feedback or issue ?</i>
              <br/>
              You can open issue or request feature on <a href="https://github.com/Mazzzoni/b4bstats" target="_blank" rel="noreferrer" className="color-primary">GitHub</a>, contact me at <a href="mailto:hello@mazz.lol" className="color-primary" rel="noreferrer" target="_blank">hello@mazz.lol</a> or ping me on <img src="/images/discord.svg" alt="discord" className="w-4 relative top-[-2px] inline"/> <b style={{color: '#7289DA'}}>Discord</b> <a href="https://discordapp.com/users/370123066594033668" className="color-primary" rel="noreferrer" target="_blank">@mazz#0385</a>.
            </p>
          </div>

          <div>
            <h3 className="mt-7 text-2xl font-bold">Contributors</h3>

            <p className="mt-3 mb-4">
              Huge thanks to contributors that participated to this project !
            </p>

            <div className="space-y-3">
              <Contributor discord name="LazyFox" contribution="Russian translations."/>
              <Contributor discord name="Ken" contribution="Chinese traditional (Taiwan) translations."/>
              <Contributor discord name="AikiPhoenix" contribution="Japanese translations."/>
              <Contributor discord name="Buttscratcher90" contribution="Spanish translations."/>
              <Contributor discord name="Hermano Juroso" contribution="Dutch translations."/>
              <Contributor discord name="domme_xo" contribution="German translations."/>
              <Contributor discord name="Hezu" contribution="riddens illustrations."/>
              <Contributor discord name="G4B3" contribution="weapons statistics icons."/>
              <Contributor discord name="Kaemanden" contribution="weapons & riddens data."/>
              <Contributor discord name="B4B Discord" contribution="feedback and contributions."/>
              <Contributor discord name="Back4Stats Discord" contribution="feedback and contributions."/>
              <Contributor name="디시인사이드 백4블러드 갤러리" contribution="Korean translations."/>
              <Contributor reddit name="Keithustus" contribution="feedback and contributions."/>
              <Contributor reddit name="B4B Reddit" contribution="feedback and contributions."/>
            </div>
          </div>
        </div>

        <div className="col-span-7">
          <h3 className="text-2xl font-bold">FAQ</h3>

          <div className="mt-3">
            <strong className="text-xl">How do I unlock ZWAT skin ?</strong>

            <p>
              To unlock ZWAT skin for a cleaner, you need to complete every mission of every act in <b>Nightmare difficulty</b> or <b>No Hope difficulty</b> with that cleaner.
            </p>
          </div>

          <Divider variant="dashed" my={20}/>

          <div>
            <strong className="text-xl">I can not find statistics file with Xbox Game Pass, help !</strong>

            <p>
              <b>Xbox Game Pass</b> stores your files differently than <b>Steam</b> or <b>Epic Games Store</b>, please go to the mentioned folder:
              <br/>
              <Kbd className="color-primary color-bg-secondary"><b>{'<disk>:\\Users\\<username>\\AppData\\Local\\Packages\\WarnerBros.Interactive.<some key>\\SystemAppData\\wgs\\'}</b></Kbd>
              <br/>
              You&apos;ll see a first sub folder with a special name (something like <Kbd className="color-primary color-bg-secondary"><b>00901F5LDP...</b></Kbd>), open it.
              <br/>
              Then you&apos;ll find more subfolders with special names, each contain 2 files, try the file with the special name (not the <code><b>container</b></code> one)
              <br/>
              Usually, the most recent modified file is the one that contain your statistics, you can sort your files by date and try them until it works.
            </p>
          </div>

          <Divider variant="dashed" my={20}/>

          <div>
            <strong className="text-xl">Support for consoles ?</strong>

            <p>
              At the moment, there&apos;s no way to extract statistics file from consoles, so no support for consoles players sadly...
              <br/>
              If you found a way to extract your statistics from console, please get in touch with me to update instructions.
            </p>
          </div>

          <Divider variant="dashed" my={20}/>

          <div>
            <strong className="text-xl">How it works ?</strong>

            <p>
              The application is made entirely with <b>JavaScript</b>, it means all processing of your statistics is done within your browser, there&apos;s no server involved.
              <br/>
              Your statistics file is being parsed then all data remain temporarily in your browser to be displayed, that&apos;s why you need to drag and drop file every time you refresh page.
              <br/>
              Application source code is available on <a href="https://github.com/Mazzzoni/b4bstats" target="_blank" rel="noreferrer" className="color-primary">GitHub</a> under <strong>MIT License</strong>. You&apos;re welcome to contribute to it or use it as you wish !
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Page;