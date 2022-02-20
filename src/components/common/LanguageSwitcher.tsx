import i18n from '@translations/i18n';
import { Languages, languagesIcons, languagesLabels } from '@translations/Languages';
import { useForceUpdate } from '@mantine/hooks';

export default function LanguageSwitcher() {
  const forceUpdate = useForceUpdate();

  const changeLanguage = async (language: string) => {
    await i18n.changeLanguage(language);
    forceUpdate();
  };

  return (
    <div className="space-x-2 flex align-center">
      {Object.values(Languages).map((language) => (
        <span
          key={language}
          onClick={() => changeLanguage(language)}
          className={`flag-icon flag-icon-${languagesIcons[language]} cursor-pointer ${language === i18n.language && 'border-primary-bottom'}`}
          title={languagesLabels[language]}
        />
      ))}
    </div>
  );
}