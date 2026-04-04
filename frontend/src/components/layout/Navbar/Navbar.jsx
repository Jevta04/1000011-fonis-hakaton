import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Car, LogOut, Menu, X,
} from 'lucide-react';
import { useTheme }       from '../../../hooks/useTheme';
import { useTranslation } from '../../../hooks/useTranslation';
import { logout }         from '../../../services/apiService';
import { ThemeSwitch }    from '../../ThemeSwitch/ThemeSwitch';
import { LocaleSwitch }   from '../../LocaleSwitch/LocaleSwitch';
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
    ...(isAdmin ? [{ to: '/admin', label: t('nav_admin') }] : []),
  ];

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        {/* Logo */}
        <NavLink to="/" className="navbar__logo">
          <Car size={22} strokeWidth={2} />
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

        {/* Desna strana */}
        <div className="navbar__controls">
          {/* Locale toggle */}
          <LocaleSwitch locale={locale} onToggle={toggleLocale} />

          {/* Theme toggle */}
          <ThemeSwitch isDark={isDark} onToggle={toggleTheme} />

          {/* Avatar + Logout */}
          <div className="navbar__user">
            <NavLink to="/profile" className="navbar__avatar">
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </NavLink>
            <button
              className="navbar__logout"
              onClick={handleLogout}
              title={t('logout')}
            >
              <LogOut size={15} />
            </button>
          </div>

          {/* Hamburger */}
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Meni"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
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
            <LogOut size={15} />
            {t('nav_logout')}
          </button>
        </nav>
      )}
    </header>
  );
}