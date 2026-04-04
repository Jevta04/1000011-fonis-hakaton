import { NavLink } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import './BottomNav.css';

const NAV_ITEMS = [
  { to: '/',        icon: '🏠', labelKey: 'nav_home'    },
  { to: '/search',  icon: '🔍', labelKey: 'nav_search'  },
  { to: '/publish', icon: '➕', labelKey: 'nav_publish' },
  { to: '/history', icon: '📋', labelKey: 'nav_history' },
  { to: '/profile', icon: '👤', labelKey: 'nav_profile' },
];

export function BottomNav() {
  const { t } = useTranslation();

  return (
    <nav className="bottom-nav" aria-label="Navigacija">
      {NAV_ITEMS.map(({ to, icon, labelKey }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`
          }
        >
          <span className="bottom-nav__icon" aria-hidden="true">{icon}</span>
          <span className="bottom-nav__label">{t(labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
