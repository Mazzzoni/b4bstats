import 'chart.js/auto';
import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { I18nextProvider } from 'react-i18next';
import { createLanguageInstance } from '@translations/i18n';
import { languageForLocale } from '@translations/locales';
import type { AppProps } from 'next/app';
import { Provider } from 'jotai';
import { MantineProvider, createTheme } from '@mantine/core';
import { ToastContainer } from 'react-toastify';
import Script from 'next/script';
import { analyticsEnabled, plausibleDomain, plausibleUrl } from '@utils/analytics';
import 'flag-icons/css/flag-icons.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '@styles/globals.css';
const theme = createTheme({
  primaryColor: 'b4b',
  primaryShade: 6,
  colors: {
    b4b: [
      '#fff0ee',
      '#ffdad5',
      '#ffb8ad',
      '#ff8c7d',
      '#f55b49',
      '#e63120',
      '#d41002',
      '#ad0c00',
      '#870a00',
      '#600700',
    ],
    dark: [
      '#eeeeee',
      '#c4c7cb',
      '#a4a8ae',
      '#727880',
      '#4b5158',
      '#34383d',
      '#25292e',
      '#1d2023',
      '#151719',
      '#101214',
    ],
  },
  defaultRadius: 'sm',
  fontFamily: 'Arial, Helvetica, sans-serif',
  headings: { fontFamily: 'Arial, Helvetica, sans-serif' },
  components: {
    Badge: { defaultProps: { variant: 'outline', color: 'gray' } },
    Button: { defaultProps: { color: 'b4b' } },
    Table: { defaultProps: { verticalSpacing: 'sm', horizontalSpacing: 'md' } },
  },
});
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const language = languageForLocale(router.locale);
  const translations = useMemo(() => createLanguageInstance(language), [language]);
  useEffect(() => {
    document.documentElement.lang = router.locale === 'default' ? 'en' : (router.locale ?? 'en');
  }, [router.locale]);
  return (
    <I18nextProvider i18n={translations}>
      <Provider>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          {analyticsEnabled && (
            <Script
              strategy="afterInteractive"
              src={`${plausibleUrl}/js/script.js`}
              data-domain={plausibleDomain}
              data-api={`${plausibleUrl}/api/event`}
            />
          )}
          <Component {...pageProps} />
          <ToastContainer position="bottom-right" theme="dark" />
        </MantineProvider>
      </Provider>
    </I18nextProvider>
  );
}
