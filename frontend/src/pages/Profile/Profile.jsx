import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import {
  Car, LogOut, Verified, Phone, ShieldCheck, Cigarette, 
  Music, Dog, Wind, Zap, Plus, MessageCircle 
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { logout } from '../../services/apiService';
import { ThemeSwitch } from '../../components/ThemeSwitch/ThemeSwitch';
import { LocaleSwitch } from '../../components/LocaleSwitch/LocaleSwitch';
import './Profile.css';

export function Profile() {
  const { isDark, toggleTheme } = useTheme();
  const { t, locale, toggleLocale } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const activeHref = location.pathname;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Podaci korisnika
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
    { to: '/', label: t('nav_home') },
    { to: '/search', label: t('nav_search') },
    { to: '/publish', label: t('nav_publish') || 'Nova ruta' },
    ...(isAdmin ? [{ to: '/admin', label: t('nav_admin') }] : []),
  ];

  // GSAP Refs za Navbar
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const logoImgRef = useRef(null);
  const logoTweenRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);
  const logoRef = useRef(null);

  // Boje za Navbar
  const cssVars = {
    '--base': isDark ? '#191A19' : '#ffffff',
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
        gsap.fromTo(menu, { opacity: 0, y: 10, scaleY: 1 }, { opacity: 1, y: 0, scaleY: 1, duration: 0.3, ease, transformOrigin: 'top center' });
      } else {
        gsap.to(menu, { opacity: 0, y: 10, scaleY: 1, duration: 0.2, ease, transformOrigin: 'top center', onComplete: () => gsap.set(menu, { visibility: 'hidden' }) });
      }
    }
  };

  return (
    <div className={`profile-page-wrapper ${isDark ? 'theme-dark' : 'theme-light'}`}>
      
      {/* --- NAVBAR --- */}
      <div className="pill-nav-container">
        <nav className="pill-nav" aria-label="Primary" style={cssVars}>
          
          <NavLink className="pill-logo" to="/" aria-label="Home" onMouseEnter={handleLogoEnter} onClick={handleLogoClick} ref={logoRef}>
            <div ref={logoImgRef} className="flex items-center justify-center">
              <Car size={24} strokeWidth={2.5} color={isDark ? '#f5f7f8' : '#191A19'} />
            </div>
          </NavLink>

          <div className="pill-nav-items desktop-only" ref={navItemsRef}>
            <ul className="pill-list" role="menubar">
              {navLinks.map((item, i) => (
                <li key={item.to} role="none">
                  <NavLink role="menuitem" to={item.to} className={`pill ${activeHref === item.to ? 'is-active' : ''}`} onMouseEnter={() => handleEnter(i)} onMouseLeave={() => handleLeave(i)}>
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
              <NavLink to="/profile" className="pill-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || 'M'}
              </NavLink>
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
                <NavLink to={item.to} className={`mobile-menu-link ${activeHref === item.to ? 'is-active' : ''}`} onClick={() => toggleMobileMenu()}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="mobile-menu-controls-row">
              <LocaleSwitch locale={locale} onToggle={toggleLocale} />
              <ThemeSwitch isDark={isDark} onToggle={toggleTheme} />
              <button className="mobile-menu-link text-red-500 font-bold w-full text-left" onClick={handleLogout}>
                <LogOut size={16} className="inline mr-2" /> {t('nav_logout') || 'Odjavi se'}
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="navbar-spacer"></div>

      {/* --- PROFIL SADRŽAJ --- */}
      <div className="profile-content-box">

        {/* HEADER KARTICA (Gradient, Glow i Horizontalni Layout) */}
        <div className="profile-header">
          
          {/* Levi deo: Avatar */}
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'M'}</div>
            <div className="profile-verified-badge">
              <ShieldCheck size={16} strokeWidth={2.5} />
            </div>
          </div>

          {/* Srednji deo: Info */}
          <div className="profile-info">
            <h1>{user?.name || 'Marko Petrović'}</h1>
            <p><span className="icon-mail">✉</span> {user?.email || 'marko@kompanija.com'}</p>
            <p><span className="icon-building">🏢</span> Kompanija d.o.o.</p>
            <p><span className="icon-phone">📞</span> +381 63 •••• 789</p>
            
            <div className="profile-badges">
              <span className="badge"><Verified size={14} /> Email verified</span>
              <span className="badge"><Phone size={14} /> Phone verified</span>
              <span className="badge"><ShieldCheck size={14} /> Trusted member</span>
            </div>
          </div>

          {/* Desni deo: Statistika */}
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">0</span>
              <span className="stat-label">As driver</span>
            </div>
            <div className="stat">
              <span className="stat-number">0</span>
              <span className="stat-label">As passenger</span>
            </div>
          </div>
        </div>

        {/* DONJI RED KARTICA */}
        <div className="profile-grid">
          
          {/* MOJE VOZILO */}
          <div className="profile-card">
            <h2 className="card-title"><Car size={20} /> My vehicle</h2>
            <button className="add-vehicle-btn">
              <Plus size={24} className="add-icon" />
              <span className="add-title">Add your vehicle</span>
              <span className="add-subtitle">Help passengers know what to expect</span>
            </button>
          </div>

          {/* SKLONOSTI U VOŽNJI */}
          <div className="profile-card">
            <h2 className="card-title">Ride preferences</h2>
            <div className="preferences-list">
              <span className="pref-tag"><Cigarette size={14} /> No smoking</span>
              <span className="pref-tag"><Music size={14} /> Music OK</span>
              <span className="pref-tag"><MessageCircle size={14} /> Chatty</span>
              <span className="pref-tag"><Dog size={14} /> Pets allowed</span>
              <span className="pref-tag"><Wind size={14} /> AC always on</span>
              <span className="pref-tag"><Zap size={14} /> Fast driver</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}