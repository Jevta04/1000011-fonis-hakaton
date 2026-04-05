import { NavLink } from 'react-router-dom';
import { Home, Search, PlusCircle, User, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import './BottomNav.css';

const BASE_ITEMS = [
  { to: '/',        Icon: Home,       labelKey: 'nav_home'    },
  { to: '/search',  Icon: Search,     labelKey: 'nav_search'  },
  { to: '/publish', Icon: PlusCircle, labelKey: 'nav_publish' },
  { to: '/profile', Icon: User,       labelKey: 'nav_profile' },
];

export function BottomNav() {
  const { t } = useTranslation();

  const stored = localStorage.getItem('user');
  const isAdmin = stored ? JSON.parse(stored)?.role === 'admin' : false;

  const navItems = isAdmin
    ? [...BASE_ITEMS, { to: '/admin', Icon: ShieldCheck, labelKey: 'admin_panel' }]
    : BASE_ITEMS;

  return (
    <nav className="bottom-nav" aria-label="Navigacija">
      {navItems.map(({ to, Icon, labelKey }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`
          }
        >
          <Icon size={22} strokeWidth={1.75} className="bottom-nav__icon" />
          <span className="bottom-nav__label">{t(labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
