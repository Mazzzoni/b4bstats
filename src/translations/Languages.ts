export enum Languages
{
  enEN = 'en-EN',
  frFR = 'fr-FR',
  deDE = 'de-DE',
  esES = 'es-ES',
  nlNL = 'nl-NL',
  ruRU = 'ru-RU',
  zhTW = 'zh-TW',
  jpJP = 'jp-JP',
  krKR = 'kr-KR',
}

export const languagesIcons: Record<Languages, string> = {
  [Languages.enEN]: 'gb',
  [Languages.frFR]: 'fr',
  [Languages.deDE]: 'de',
  [Languages.esES]: 'es',
  [Languages.nlNL]: 'nl',
  [Languages.ruRU]: 'ru',
  [Languages.zhTW]: 'tw',
  [Languages.jpJP]: 'jp',
  [Languages.krKR]: 'kr',
};

export const languagesLabels: Record<Languages, string> = {
  [Languages.enEN]: 'English',
  [Languages.frFR]: 'Français',
  [Languages.deDE]: 'Deutsch',
  [Languages.esES]: 'Española',
  [Languages.nlNL]: 'Nederlands',
  [Languages.ruRU]: 'русский',
  [Languages.zhTW]: '台灣中文',
  [Languages.jpJP]: '日本',
  [Languages.krKR]: '한국인',
};