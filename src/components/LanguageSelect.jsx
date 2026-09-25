import { useLanguage } from '../i18n/LanguageContext';

export function LanguageSelect() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="field">
      <label>{t('language')}</label>
      <select value={lang} onChange={(e) => setLang(e.target.value)}>
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
}
