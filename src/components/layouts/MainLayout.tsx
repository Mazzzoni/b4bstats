import { useUI } from '@translations/useUI';
import { useState, type ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AppShell, Burger, NavLink, ScrollArea } from '@mantine/core';
import { useAtomValue } from 'jotai';
import LanguageSwitcher from '@components/common/LanguageSwitcher';
import SelfQuicklinks from './SelfQuicklinks';
import RiddensQuicklinks from './RiddensQuicklinks';
import WeaponsQuicklinks from './WeaponsQuicklinks';
import StatisticsState from '@components/self/StatisticsState';
const links = [
  ['/', 'Overview'],
  ['/self', 'Local save'],
  ['/compare', 'Compare'],
  ['/weapons', 'Weapons'],
  ['/riddens', 'Ridden'],
  ['/about', 'About'],
];
export default function MainLayout({
  children,
  title,
  sidebar,
}: {
  children: ReactNode;
  title: string;
  sidebar?: ReactNode;
}) {
  const tr = useUI();
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const stats = useAtomValue(StatisticsState);
  return (
    <>
      <Head>
        <title>{title} | B4BSTATS</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#d41002" />
      </Head>
      <AppShell
        header={{ height: 64 }}
        navbar={{ width: 224, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding={0}
      >
        <AppShell.Header className="!border-line !bg-background">
          <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-7">
            <div className="flex items-center gap-4">
              <Burger
                opened={opened}
                onClick={() => setOpened(!opened)}
                hiddenFrom="sm"
                aria-label="Toggle navigation"
                size="sm"
              />
              <Link href="/" className="text-2xl font-black tracking-tight text-brand">
                B4BSTATS
              </Link>
              <span className="hidden border-l border-line pl-4 text-[10px] font-bold tracking-[.2em] text-muted lg:block">
                FORT HOPE INTELLIGENCE
              </span>
            </div>
            <LanguageSwitcher />
          </div>
        </AppShell.Header>
        <AppShell.Navbar className="!border-line !bg-background p-4">
          <ScrollArea
            className="flex-1"
            type="auto"
            onClickCapture={(event) => {
              if ((event.target as HTMLElement).closest('.profile-shortcuts a')) setOpened(false);
            }}
          >
            <nav aria-label="Main navigation" className="space-y-1">
              {links.map(([href, label]) => (
                <div key={href}>
                  <NavLink
                    component={Link}
                    href={href}
                    label={tr(label)}
                    active={
                      router.pathname === href ||
                      (href === '/' && ['/leaderboards', '/overall'].includes(router.pathname))
                    }
                    onClick={() => setOpened(false)}
                    className="rounded font-semibold"
                    variant="light"
                  />
                  {router.pathname === href && href === '/self' && stats.hydrated && (
                    <div className="mt-3">
                      <SelfQuicklinks />
                    </div>
                  )}
                  {router.pathname === href && href === '/weapons' && (
                    <div className="mt-3">
                      <WeaponsQuicklinks />
                    </div>
                  )}
                  {router.pathname === href && href === '/riddens' && (
                    <div className="mt-3">
                      <RiddensQuicklinks />
                    </div>
                  )}
                </div>
              ))}
            </nav>
            {sidebar}
          </ScrollArea>
          <div className="mt-6 space-y-3 border-t border-line pt-5 text-xs text-muted">
            <p>Community stats, built for cleaners.</p>
            <a href="https://github.com/Mazzzoni/b4bstats" target="_blank" rel="noreferrer">
              Source & feedback ↗
            </a>
          </div>
        </AppShell.Navbar>
        <AppShell.Main className="!bg-background">
          <div className="site-content mx-auto max-w-7xl px-4 py-8 sm:px-7 sm:py-10">
            {children}
          </div>
        </AppShell.Main>
      </AppShell>
    </>
  );
}
