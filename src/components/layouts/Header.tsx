import Link from 'next/link';
import { Header as HeaderMT, HeaderProps } from '@mantine/core';
import LanguageSwitcher from '@components/common/LanguageSwitcher';

export default function Header(props: Omit<HeaderProps, 'children'>) {
  return (
    <HeaderMT {...props}>
      <div className="flex justify-between">
        <Link href="/">
          <a><h1 className="font-bold color-primary">B4BSTATS</h1></a>
        </Link>
        <LanguageSwitcher/>
      </div>
    </HeaderMT>
  );
}