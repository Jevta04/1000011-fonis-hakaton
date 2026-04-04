import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm }      from '../../components/auth/LoginForm/LoginForm';
import { SignupForm }     from '../../components/auth/SignupForm/SignupForm';
import { ThemeSwitch }    from '../../components/ThemeSwitch/ThemeSwitch';
import { LocaleSwitch }   from '../../components/LocaleSwitch/LocaleSwitch';
import { useTheme }       from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import './Login.css';

export function Login() {
  const navigate = useNavigate();
  const { isDark, toggleTheme }       = useTheme();
  const { locale, toggleLocale, t }   = useTranslation();
  const [activeTab, setActiveTab]     = useState('login');

  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className="login-page">
      <div className="login-page__bg-shape login-page__bg-shape--1" aria-hidden="true" />
      <div className="login-page__bg-shape login-page__bg-shape--2" aria-hidden="true" />

      {/* Kontrole */}
      <div className="login-page__controls">
        <LocaleSwitch locale={locale} onToggle={toggleLocale} />
        <ThemeSwitch isDark={isDark} onToggle={toggleTheme} />
      </div>

      {/* Kartica */}
      <main className="login-page__card">
        {/* Tabovi */}
        <div className="login-page__tabs" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'login'}
            className={`login-page__tab ${activeTab === 'login' ? 'login-page__tab--active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            {t('login_tab')}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'register'}
            className={`login-page__tab ${activeTab === 'register' ? 'login-page__tab--active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            {t('register_tab')}
          </button>
        </div>

        {/* Sadržaj taba */}
        <div className="login-page__tab-content" role="tabpanel">
          {activeTab === 'login'
            ? <LoginForm onSwitchToRegister={() => setActiveTab('register')} />
            : <SignupForm onSwitchToLogin={() => setActiveTab('login')} />
          }
        </div>
      </main>

      <footer className="login-page__footer">
        <p className="login-page__footer-text">{t('app_name')} · {t('tagline')}</p>
      </footer>
    </div>
  );
}
