import { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { MantineProvider } from '@mantine/core';
import { ToastContainer } from 'react-toastify';
import { pageView } from '@utils/analytics';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import 'flag-icon-css/css/flag-icons.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '@styles/main.scss';

export default function App(props: AppProps) {
  const {Component, pageProps} = props;

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => pageView(url);

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  return (
    <RecoilRoot>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
      />

      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
                      
            gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

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