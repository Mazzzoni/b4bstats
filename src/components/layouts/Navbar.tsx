import { Button, Group, Navbar as NavbarMT, NavbarProps } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import StatisticsState from '@components/self/StatisticsState';
import { Fragment } from 'react';
import Quicklinks from '@components/layouts/Quicklinks';

const menu = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Self',
    href: '/self',
  },
  {
    label: 'Compare',
    href: '/compare',
  },
  {
    label: 'About',
    href: '/about',
  },
];

const footerMainMenu = [
  {label: 'GitHub', href: 'https://github.com/Mazzzoni/b4bstats'},
  {label: 'Report bug', href: 'https://github.com/Mazzzoni/b4bstats/issues'},
  {label: 'Request feature', href: 'https://github.com/Mazzzoni/b4bstats/issues'},
];

export default function Navbar(props: Omit<NavbarProps, 'children'>) {
  const router = useRouter();
  const statistics = useRecoilValue(StatisticsState);

  return (
    <NavbarMT {...props}>
      <NavbarMT.Section grow>
        <Group direction="column" grow>
          {menu.map(item => (
            <Fragment key={item.href}>
              <Link href={item.href} passHref>
                <Button
                  component="a"
                  color="dark"
                  styles={{inner: {justifyContent: 'flex-start'}}}
                  variant={router.pathname === item.href ? 'default' : 'subtle'}
                  className={router.pathname === item.href ? 'color-primary' : ''}
                >{item.label}</Button>
              </Link>

              {statistics.hydrated && item.label === 'Self' && router.pathname === '/self' && <Quicklinks/>}
            </Fragment>
          ))}
        </Group>
      </NavbarMT.Section>

      <NavbarMT.Section className="border-top-subtle pt-4 pl-3 text-xs">
        <div className="flex">
          <ul className="space-y-2">
            {footerMainMenu.map(item => (
              <li key={item.label}>
                <a href={item.href} className="hover:text-gray-300" target="_blank" rel="noreferrer">{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </NavbarMT.Section>
    </NavbarMT>
  );
}