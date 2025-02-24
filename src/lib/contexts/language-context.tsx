import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(() => {
    const storedLang = localStorage.getItem('webpilot-language');
    if (storedLang && ['en', 'fr', 'es', 'pt', 'de'].includes(storedLang)) {
      return storedLang;
    }
    
    const browserLang = navigator.language.split('-')[0];
    return ['en', 'fr', 'es', 'pt', 'de'].includes(browserLang) ? browserLang : 'en';
  });

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('webpilot-language', language);
  }, [language, i18n]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);