import { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { ToastContainer } from 'react-toastify';

import 'flag-icon-css/css/flag-icons.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '@styles/main.scss';
import { RecoilRoot } from 'recoil';

export default function App(props: AppProps) {
  const {Component, pageProps} = props;

  return (
    <RecoilRoot>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'dark',
          // Remove all border radius
          radius: {xs: 0, sm: 0, md: 0, lg: 0, xl: 0},
        }}
      >
        <Component {...pageProps} />

        <ToastContainer
          position="bottom-right"
          theme="dark"
          style={{
            width: '600px',
          }}
        />
      </MantineProvider>
    </RecoilRoot>
  );
}