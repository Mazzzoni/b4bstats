import { useRouter } from 'next/router';
import { Languages, languagesIcons, languagesLabels } from '@translations/Languages';
import { languageForLocale, localeForLanguage } from '@translations/locales';
export default function LanguageSwitcher() {
  const router = useRouter();
  const current = languageForLocale(router.locale);
  function changeLanguage(language: string) {
    const locale = localeForLanguage(language);
    document.cookie = 'NEXT_LOCALE=' + locale + '; Path=/; Max-Age=31536000; SameSite=Lax';
    void router.push(
      { pathname: router.pathname, query: router.query, hash: window.location.hash },
      router.asPath,
      { locale, scroll: false },
    );
  }
  return (
    <div className="site-language">
      <div className="site-language-flags">
        {Object.values(Languages).map((language) => (
          <button
            type="button"
            key={language}
            onClick={() => changeLanguage(language)}
            title={languagesLabels[language]}
            aria-label={languagesLabels[language]}
            aria-pressed={language === current}
          >
            <span className={'fi fi-' + languagesIcons[language]} />
          </button>
        ))}
      </div>
      <select
        className="site-language-select"
        aria-label="Language"
        value={current}
        onChange={(event) => changeLanguage(event.target.value)}
      >
        {Object.values(Languages).map((language) => (
          <option key={language} value={language}>
            {languagesLabels[language]}
          </option>
        ))}
      </select>
    </div>
  );
}
