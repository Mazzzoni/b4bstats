import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enEN from './languages/en-EN.json';
import frFR from './languages/fr-FR.json';
import deDE from './languages/de-DE.json';
import esES from './languages/es-ES.json';
import nlNL from './languages/nl-NL.json';
import ruRU from './languages/ru-RU.json';
import zhTW from './languages/zh-TW.json';
import jpJP from './languages/jp-JP.json';
import krKR from './languages/kr-KR.json';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en-EN',
    defaultNS: 'global',
    debug: false,
    lng: 'en-EN',
    initImmediate: false,
    preload: ['en-EN'],
  });

i18n.addResourceBundle('en-EN', 'global', enEN);
i18n.addResourceBundle('fr-FR', 'global', frFR);
i18n.addResourceBundle('de-DE', 'global', deDE);
i18n.addResourceBundle('es-ES', 'global', esES);
i18n.addResourceBundle('nl-NL', 'global', nlNL);
i18n.addResourceBundle('ru-RU', 'global', ruRU);
i18n.addResourceBundle('zh-TW', 'global', zhTW);
i18n.addResourceBundle('jp-JP', 'global', jpJP);
i18n.addResourceBundle('kr-KR', 'global', krKR);

export default i18n;
