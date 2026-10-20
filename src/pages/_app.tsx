import { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { MantineProvider } from '@mantine/core';
import { ToastContainer } from 'react-toastify';
import { analyticsEnabled, plausibleDomain, plausibleUrl } from '@utils/analytics';
import Script from 'next/script';

import 'flag-icon-css/css/flag-icons.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '@styles/main.scss';

export default function App(props: AppProps) {
  const {Component, pageProps} = props;

  return (
    <RecoilRoot>
      {analyticsEnabled && (
        <Script
          id="plausible-analytics"
          strategy="afterInteractive"
          src={`${plausibleUrl}/js/script.js`}
          data-domain={plausibleDomain}
          data-api={`${plausibleUrl}/api/event`}
        />
      )}

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'dark',
          // Remove all border radius
          radius: {xs: 0, sm: 0, md: 0, lg: 0, xl: 0},
        }}
      >
        <Component {...pageProps}/>

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
