import { Outlet } from 'react-router-dom';
import { Navbar }    from '../Navbar/Navbar';
import { BottomNav } from '../BottomNav/BottomNav';
import './MainLayout.css';

/**
 * MainLayout – shell aplikacije.
 *
 * Mobile  (<768px): Navbar je skriven, BottomNav je fiksiran dole.
 * Desktop (≥768px): Navbar je fiksiran gore, BottomNav je skriven.
 *
 * <Outlet /> renderuje aktivnu stranicu unutar main elementa.
 */
export function MainLayout() {
  return (
    <div className="main-layout">
      <Navbar />

      <main className="main-layout__content page-enter">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
