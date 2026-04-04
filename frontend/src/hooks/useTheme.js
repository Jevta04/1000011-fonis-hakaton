import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * useTheme – hook za upravljanje temom aplikacije.
 *
 * Upotreba:
 *   const { theme, isDark, toggleTheme } = useTheme();
 *
 *   <button onClick={toggleTheme}>
 *     {isDark ? '☀️ Svetla tema' : '🌙 Tamna tema'}
 *   </button>
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme mora biti korišćen unutar <ThemeProvider>');
  }

  return context;
}
