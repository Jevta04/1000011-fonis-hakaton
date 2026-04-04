import { createContext, useState, useEffect, useCallback } from 'react';

export const ThemeContext = createContext(null);

/**
 * ThemeProvider – upravlja dark/light modom.
 *
 * Redosled prioriteta pri inicijalizaciji:
 *   1. Vrednost u localStorage ('dark' | 'light')
 *   2. Sistemsko podešavanje (prefers-color-scheme)
 *   3. Fallback: 'light'
 *
 * Promena teme:
 *   – dodaje/uklanja klasu 'dark' na <html>
 *   – čuva izbor u localStorage
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Inline skripta u index.html je već aplicirala klasu.
    // Ovde samo sinhronizujemo state sa DOM-om.
    if (typeof window === 'undefined') return 'light';

    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Sinhronizuj DOM kad god se theme promeni
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Prati sistemsku promenu ako korisnik nije ručno izabrao
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return; // Korisnik je ručno izabrao – ne override-uj

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setLightTheme = useCallback(() => setTheme('light'), []);
  const setDarkTheme  = useCallback(() => setTheme('dark'),  []);

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, setLightTheme, setDarkTheme, isDark: theme === 'dark' }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
