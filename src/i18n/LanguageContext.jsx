import { createContext, useContext, useMemo, useState } from 'react';
import { translate } from './translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const value = useMemo(
    () => ({
      lang,
      setLang: (next) => {
        // Keep Arabic in the menu; UI strings fall back to English.
        setLang(next);
      },
      t: (key, vars) => translate(lang, key, vars),
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
