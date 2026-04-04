import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Globalni stilovi – moraju biti pre komponenti
import './styles/global.css';

// ── DEV AUTO-LOGIN ──────────────────────────────────────────
// Ako je VITE_DEV_AUTO_LOGIN=true u .env, automatski setuje
// fake token i korisnika kako bi Dashboard bio vidljiv bez backend-a.
// U produkciji (.env.production) ova varijabla ne postoji → nema efekta.
if (import.meta.env.VITE_DEV_AUTO_LOGIN === 'true' && !localStorage.getItem('token')) {
  localStorage.setItem('token', 'dev-fake-token');
  localStorage.setItem('user', JSON.stringify({
    id:      1,
    name:    import.meta.env.VITE_DEV_USER_NAME  || 'Dev Korisnik',
    role:    import.meta.env.VITE_DEV_USER_ROLE  || 'employee',
    email:   'marko@kompanija.com',
    company: { name: 'Kompanija d.o.o.' },
    rating:  4.8,
  }));
}
// ────────────────────────────────────────────────────────────

// Context provideri
import { ThemeProvider }    from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*
      Redosled provajdera:
        ThemeProvider    → najširi, potreban svuda
        LanguageProvider → unutar theme-a (može koristiti temu u prevodu)
        App              → cela aplikacija
    */}
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>
);
