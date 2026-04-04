import { NavLink } from 'react-router-dom';
import { Home, Search, PlusCircle, ClipboardList, User } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import './BottomNav.css';

const NAV_ITEMS = [
  { to: '/',        Icon: Home,          labelKey: 'nav_home'    },
  { to: '/search',  Icon: Search,        labelKey: 'nav_search'  },
  { to: '/publish', Icon: PlusCircle,    labelKey: 'nav_publish' },
  { to: '/profile', Icon: ClipboardList, labelKey: 'nav_history' },
  { to: '/profile', Icon: User,          labelKey: 'nav_profile' },
];

export function BottomNav() {
  const { t } = useTranslation();

  return (
    <nav className="bottom-nav" aria-label="Navigacija">
      {NAV_ITEMS.map(({ to, Icon, labelKey }) => (
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
