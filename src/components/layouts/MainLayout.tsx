import React, { useState } from 'react';
import Head from 'next/head';
import { AppShell } from '@mantine/core';
import Navbar from '@components/layouts/Navbar';
import Header from '@components/layouts/Header';

type Props = {
  children: React.ReactNode
  title: string
}

export default function MainLayout({children, title}: Props) {
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      fixed
      padding='md'
      navbar={<Navbar
        padding='xs'
        height='100vh'
        className='pt-[79px] overflow-y-auto'
        width={{base: 240}}
        hidden={!opened}
        hiddenBreakpoint='sm'
      />}
      navbarOffsetBreakpoint='sm'
      header={<Header
        height='auto'
        padding='md'
        className='py-2 pl-7 z-[101]'
        opened={opened}
        setOpened={setOpened}
      />}
      styles={(theme) => ({
        main: {backgroundColor: theme.colors.dark[8]},
      })}
    >
      <Head>
        <title>{title} | B4BSTATS</title>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width'/>
      </Head>

      <div className='py-28 pr-4 max-w-7xl mx-auto'>
        {children}
      </div>
    </AppShell>
  );
}