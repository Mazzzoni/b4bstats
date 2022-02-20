import { Header as HeaderMT, HeaderProps } from '@mantine/core';
import LanguageSwitcher from '@components/common/LanguageSwitcher';

export default function Header(props: Omit<HeaderProps, 'children'>) {
  return (
    <HeaderMT {...props}>
      <div className="flex justify-between">
        <h1 className="font-bold text-xl2 color-primary">B4BSTATS</h1>
        <LanguageSwitcher/>
      </div>
    </HeaderMT>
  );
}