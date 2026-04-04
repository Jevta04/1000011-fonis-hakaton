import { Navigate, Outlet } from 'react-router-dom';

/**
 * PrivateRoute – štiti rute od neautentifikovanih korisnika.
 *
 * Upotreba u App.jsx:
 *   <Route element={<PrivateRoute />}>
 *     <Route path="/" element={<Dashboard />} />
 *   </Route>
 *
 * AdminRoute – dodatna provera admin role:
 *   <Route element={<PrivateRoute requireAdmin />}>
 *     <Route path="/admin" element={<Admin />} />
 *   </Route>
 */
export function PrivateRoute({ requireAdmin = false }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // Sačuvaj trenutni URL da bismo korisnika vratili posle logina
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role !== 'admin') {
        return <Navigate to="/" replace />;
      }
    } catch {
      return <Navigate to="/login" replace />;
    }
  }

  // Renderuj child rute
  return <Outlet />;
}
