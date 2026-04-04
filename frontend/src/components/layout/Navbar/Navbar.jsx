import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { Car, LogOut } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { useTranslation } from '../../../hooks/useTranslation';
import { logout } from '../../../services/apiService';
import { ThemeSwitch } from '../../ThemeSwitch/ThemeSwitch';
import { LocaleSwitch } from '../../LocaleSwitch/LocaleSwitch';
import './Navbar.css';

export function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { t, locale, toggleLocale } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const activeHref = location.pathname;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); }
    catch { return {}; }
  })();
  const isAdmin = user?.role === 'admin';

  const handleLogout = async () => {
    try { await logout(); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const navLinks = [
    { to: '/', label: t('nav_home') },
    { to: '/search', label: t('nav_search') },
    { to: '/publish', label: t('nav_publish') },
    ...(isAdmin ? [{ to: '/admin', label: t('nav_admin') }] : []),
  ];

  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const logoImgRef = useRef(null);
  const logoTweenRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);
  const logoRef = useRef(null);

  const cssVars = {
    '--base': isDark ? '#191A19' : '#f5f7f8',
    '--pill-text': isDark ? '#f5f7f8' : '#191A19',
    '--hover-bg': '#1e5128',
    '--hover-text': '#f5f7f8',
    '--active-dot': isDark ? '#d8e9a8' : '#1e5128',
    '--border-color': isDark ? '#1e5128' : '#d8e9a8'
  };

  useEffect(() => {
    const ease = 'power3.easeOut';

    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);
        if (label) tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    setTimeout(layout, 100);

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    const menu = mobileMenuRef.current;
    if (menu) gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1 });

    const logo = logoRef.current;
    if (logo) {
      gsap.set(logo, { scale: 0 });
      gsap.to(logo, { scale: 1, duration: 0.6, ease });
    }

    return () => window.removeEventListener('resize', onResize);
  }, [navLinks.length, isDark]);

  const handleEnter = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease: 'power3.easeOut', overwrite: 'auto' });
  };

  const handleLeave = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease: 'power3.easeOut', overwrite: 'auto' });
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, { rotate: 360, duration: 0.4, ease: 'power3.easeOut', overwrite: 'auto' });
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    const ease = 'power3.easeOut';

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(menu,
          { opacity: 0, y: 10, scaleY: 1 },
          { opacity: 1, y: 0, scaleY: 1, duration: 0.3, ease, transformOrigin: 'top center' }
        );
      } else {
        gsap.to(menu, {
          opacity: 0, y: 10, scaleY: 1, duration: 0.2, ease, transformOrigin: 'top center',
          onComplete: () => gsap.set(menu, { visibility: 'hidden' })
        });
      }
    }
  };

  return (
    <>
      <div className="pill-nav-container">
        <nav className="pill-nav" aria-label="Primary" style={cssVars}>

          <NavLink
            className="pill-logo"
            to="/"
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            onClick={handleLogoClick}
            ref={logoRef}
          >
            <div ref={logoImgRef} className="flex items-center justify-center">
              <Car size={24} strokeWidth={2.5} color={isDark ? '#f5f7f8' : '#191A19'} />
            </div>
          </NavLink>

          <div className="pill-nav-items desktop-only" ref={navItemsRef}>
            <ul className="pill-list" role="menubar">
              {navLinks.map((item, i) => (
                <li key={item.to} role="none">
                  <NavLink
                    role="menuitem"
                    to={item.to}
                    className={`pill ${activeHref === item.to ? 'is-active' : ''}`}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={() => handleLeave(i)}
                  >
                    <span className="hover-circle" aria-hidden="true" ref={el => { circleRefs.current[i] = el; }} />
                    <span className="label-stack">
                      <span className="pill-label">{item.label}</span>
                      <span className="pill-label-hover" aria-hidden="true">{item.label}</span>
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="pill-nav-controls">
              <LocaleSwitch locale={locale} onToggle={toggleLocale} />
              <ThemeSwitch isDark={isDark} onToggle={toggleTheme} />
              <button className="pill-logout-btn" onClick={handleLogout} title={t('logout')}>
                <LogOut size={18} />
              </button>
              <div className="pill-avatar-wrapper">
                <NavLink to="/profile" className="pill-avatar">
                  {user?.name?.charAt(0)?.toUpperCase() || '?'}
                </NavLink>
                <div className="pill-avatar-tooltip">
                  <span className="pill-avatar-tooltip__name">{user?.name || '—'}</span>
                  <span className="pill-avatar-tooltip__detail">{user?.email || user?.kompanija || '—'}</span>
                </div>
              </div>
            </div>
          </div>

          <button className="mobile-menu-button mobile-only" onClick={toggleMobileMenu} ref={hamburgerRef}>
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </nav>

        <div className="mobile-menu-popover mobile-only" ref={mobileMenuRef} style={cssVars}>
          <ul className="mobile-menu-list">
            {navLinks.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={`mobile-menu-link ${activeHref === item.to ? 'is-active' : ''}`}
                  onClick={() => toggleMobileMenu()}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="mobile-menu-controls-row">
              <LocaleSwitch locale={locale} onToggle={toggleLocale} />
              <ThemeSwitch isDark={isDark} onToggle={toggleTheme} />
              <button className="mobile-menu-logout" onClick={handleLogout}>
                <LogOut size={16} /> {t('nav_logout') || 'Odjavi se'}
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="navbar-spacer"></div>
    </>
  );
}
