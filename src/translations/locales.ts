import { Languages } from './Languages';
export const localeLanguages: Record<string, Languages> = {
  en: Languages.enEN,
  fr: Languages.frFR,
  de: Languages.deDE,
  es: Languages.esES,
  nl: Languages.nlNL,
  ru: Languages.ruRU,
  'zh-TW': Languages.zhTW,
  ja: Languages.jpJP,
  ko: Languages.krKR,
};
export function languageForLocale(locale?: string) {
  return localeLanguages[locale ?? 'en'] ?? Languages.enEN;
}
export function localeForLanguage(language: string) {
  return Object.entries(localeLanguages).find(([, value]) => value === language)?.[0] ?? 'en';
}
