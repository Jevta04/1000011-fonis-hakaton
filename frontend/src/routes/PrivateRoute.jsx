import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getUserProfile } from '../services/apiService';

export function PrivateRoute({ requireAdmin = false }) {
  const token = localStorage.getItem('token');
  const [valid, setValid]     = useState(null); // null = proverava, true = ok, false = nije
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!token) { setValid(false); return; }

    getUserProfile()
      .then((res) => {
        const role = res.data?.role;
        setIsAdmin(role === 'admin');
        setValid(true);
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setValid(false);
      });
  }, [token]);

  if (valid === null) return null; // loading — ne renderuj ništa

  if (!valid) return <Navigate to="/login" replace />;

  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}
