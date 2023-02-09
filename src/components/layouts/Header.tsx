import Link from 'next/link';
import { Burger, Header as HeaderMT, HeaderProps, MediaQuery } from '@mantine/core';
import LanguageSwitcher from '@components/common/LanguageSwitcher';
import _ from 'lodash';

export default function Header(props: Omit<HeaderProps, 'children'> & { opened: boolean, setOpened(opened: boolean): void }) {
  const { opened, setOpened } = props;
  return (
    <HeaderMT {..._.omit(props, 'opened', 'setOpened')}>
      <div className='flex items-center'>
        <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={() => setOpened(!opened)}
            size='sm'
            mr='xl'
          />
        </MediaQuery>
        <div className='flex flex-1 justify-between'>
          <Link href='/'>
            <a><h1 className='font-bold color-primary'>B4BSTATS</h1></a>
          </Link>
          <LanguageSwitcher/>
        </div>
      </div>
    </HeaderMT>
  );
}