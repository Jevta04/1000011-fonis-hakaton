import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

/**
 * useTranslation – hook za prevođenje UI tekstova.
 *
 * Upotreba:
 *   const { t, locale, setLocale } = useTranslation();
 *   <h1>{t('welcome')}</h1>
 *
 * Interpolacija (opciono):
 *   t('seats_count', { count: 3 }) → "3 slobodna mesta"
 *   JSON: "seats_count": "{{count}} slobodna mesta"
 */
export function useTranslation() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useTranslation mora biti korišćen unutar <LanguageProvider>');
  }

  const { translations, locale, setLocale, toggleLocale } = context;

  /**
   * t(key, params?) – vraća prevedeni string.
   * Ako ključ ne postoji, vraća sam ključ (lakše debugovanje).
   * Ako je params objekat, zamenjuje {{placeholder}} vrednostima.
   */
  const t = (key, params) => {
    let text = translations[key];

    if (text === undefined) {
      // Upozori u dev modu, ne u produkciji
      if (import.meta.env.DEV) {
        console.warn(`[i18n] Nedostaje ključ: "${key}" za jezik: "${locale}"`);
      }
      return key;
    }

    // Interpolacija: t('hello_name', { name: 'Marko' }) → "Zdravo, Marko"
    if (params && typeof params === 'object') {
      text = text.replace(/\{\{(\w+)\}\}/g, (_, param) =>
        params[param] !== undefined ? String(params[param]) : `{{${param}}}`
      );
    }

    return text;
  };

  return { t, locale, setLocale, toggleLocale };
}
