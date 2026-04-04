import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm }    from '../../components/auth/LoginForm/LoginForm';
import { useTheme }       from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import './Login.css';

export function Login() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { locale, toggleLocale, t } = useTranslation();

  // Ako je već ulogovan, preusmeri na dashboard
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="login-page">
      {/* Pozadinski dekorativni elementi */}
      <div className="login-page__bg-shape login-page__bg-shape--1" aria-hidden="true" />
      <div className="login-page__bg-shape login-page__bg-shape--2" aria-hidden="true" />

      {/* Kontrole (tema + jezik) – fiksne gore desno */}
      <div className="login-page__controls">
        <button
          className="login-page__control-btn"
          onClick={toggleLocale}
          title={locale === 'sr' ? 'Switch to English' : 'Promeni na srpski'}
          aria-label={t('language')}
        >
          {locale === 'sr' ? '🇷🇸 SR' : '🇬🇧 EN'}
        </button>
        <button
          className="login-page__control-btn"
          onClick={toggleTheme}
          title={isDark ? t('theme_light') : t('theme_dark')}
          aria-label={isDark ? t('theme_light') : t('theme_dark')}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Kartica sa formom */}
      <main className="login-page__card">
        <LoginForm />
      </main>

      {/* Footer */}
      <footer className="login-page__footer">
        <p className="login-page__footer-text">
          {t('app_name')} · {t('tagline')}
        </p>
      </footer>
    </div>
  );
}
