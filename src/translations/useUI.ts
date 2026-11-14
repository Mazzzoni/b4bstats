import { useTranslation } from 'react-i18next';
export function useUI() {
  const { t } = useTranslation('ui');
  return (text: string) => t(text, { keySeparator: false, defaultValue: text });
}
