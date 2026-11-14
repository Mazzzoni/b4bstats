import i18n from 'i18next';
import { ui } from './ui';
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

const resources = {
  'en-EN': { global: enEN, ui: ui.en },
  'fr-FR': { global: frFR, ui: ui.fr },
  'de-DE': { global: deDE, ui: ui.de },
  'es-ES': { global: esES, ui: ui.es },
  'nl-NL': { global: nlNL, ui: ui.nl },
  'ru-RU': { global: ruRU, ui: ui.ru },
  'zh-TW': { global: zhTW, ui: ui['zh-TW'] },
  'jp-JP': { global: jpJP, ui: ui.ja },
  'kr-KR': { global: krKR, ui: ui.ko },
};
export function createLanguageInstance(language: string) {
  const instance = i18n.createInstance();
  void instance.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: 'en-EN',
    defaultNS: 'global',
    ns: ['global', 'ui'],
    initAsync: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
  return instance;
}
export default createLanguageInstance('en-EN');
