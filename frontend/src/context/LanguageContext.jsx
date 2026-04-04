import { createContext, useState, useEffect, useCallback } from 'react';
import srTranslations from '../locales/sr.json';
import enTranslations from '../locales/en.json';

const TRANSLATIONS = {
  sr: srTranslations,
  en: enTranslations,
};

const SUPPORTED_LOCALES = ['sr', 'en'];
const DEFAULT_LOCALE    = 'sr';

export const LanguageContext = createContext(null);

/**
 * LanguageProvider – upravlja aktivnim jezikom aplikacije.
 *
 * Redosled prioriteta pri inicijalizaciji:
 *   1. Vrednost u localStorage ('sr' | 'en')
 *   2. Browser jezik (navigator.language)
 *   3. Fallback: 'sr'
 */
export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_LOCALE;

    const stored = localStorage.getItem('locale');
    if (stored && SUPPORTED_LOCALES.includes(stored)) return stored;

    // Pokušaj da detektujemo browser jezik
    const browserLang = navigator.language?.split('-')[0];
    if (SUPPORTED_LOCALES.includes(browserLang)) return browserLang;

    return DEFAULT_LOCALE;
  });

  const translations = TRANSLATIONS[locale] ?? TRANSLATIONS[DEFAULT_LOCALE];

  const setLocale = useCallback((newLocale) => {
    if (!SUPPORTED_LOCALES.includes(newLocale)) return;
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    document.documentElement.setAttribute('lang', newLocale);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'sr' ? 'en' : 'sr');
  }, [locale, setLocale]);

  // Postavi lang atribut na html pri inicijalizaciji
  useEffect(() => {
    document.documentElement.setAttribute('lang', locale);
  }, [locale]);

  return (
    <LanguageContext.Provider
      value={{ locale, translations, setLocale, toggleLocale }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
