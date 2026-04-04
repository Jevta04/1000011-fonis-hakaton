import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme }       from '../../../hooks/useTheme';
import { useTranslation } from '../../../hooks/useTranslation';
import { logout }         from '../../../services/apiService';
import './Navbar.css';

export function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { t, locale, toggleLocale } = useTranslation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); }
    catch { return {}; }
  })();

  const isAdmin = user?.role === 'admin';

  const handleLogout = async () => {
    try { await logout(); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinks = [
    { to: '/',        label: t('nav_home') },
    { to: '/search',  label: t('nav_search') },
    { to: '/publish', label: t('nav_publish') },
    { to: '/profile', label: t('nav_profile') },
    ...(isAdmin ? [{ to: '/admin', label: t('nav_admin') }] : []),
  ];

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        {/* Logo */}
        <NavLink to="/" className="navbar__logo">
          <span className="navbar__logo-icon">🚗</span>
          <span className="navbar__logo-text">{t('app_name')}</span>
        </NavLink>

        {/* Desktop nav links */}
        <nav className="navbar__links" aria-label="Glavna navigacija">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desna strana: kontrole */}
        <div className="navbar__controls">
          {/* Language toggle */}
          <button
            className="navbar__control-btn"
            onClick={toggleLocale}
            aria-label={t('language')}
            title={locale === 'sr' ? 'Switch to English' : 'Promeni na srpski'}
          >
            <span className="navbar__lang-flag">
              {locale === 'sr' ? '🇷🇸 SR' : '🇬🇧 EN'}
            </span>
          </button>

          {/* Theme toggle */}
          <button
            className="navbar__control-btn"
            onClick={toggleTheme}
            aria-label={isDark ? t('theme_light') : t('theme_dark')}
            title={isDark ? t('theme_light') : t('theme_dark')}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Avatar + Logout */}
          <div className="navbar__user">
            <span className="navbar__avatar">
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </span>
            <button
              className="navbar__logout"
              onClick={handleLogout}
              title={t('logout')}
            >
              ⎋
            </button>
          </div>

          {/* Hamburger (mobile/tablet) */}
          <button
            className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Meni"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile dropdown meni */}
      {menuOpen && (
        <nav className="navbar__mobile-menu" aria-label="Mobilna navigacija">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <button className="navbar__mobile-logout" onClick={handleLogout}>
            {t('nav_logout')}
          </button>
        </nav>
      )}
    </header>
  );
}
