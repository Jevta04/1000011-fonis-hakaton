import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './routes/PrivateRoute';
import { MainLayout } from './components/layout/MainLayout/MainLayout';

// Stranice
import { Login }         from './pages/Login/Login';
import { Dashboard }     from './pages/Dashboard/Dashboard';
import { SearchResults } from './pages/SearchResults/SearchResults';
import { PublishRide }   from './pages/PublishRide/PublishRide';
import { Profile }       from './pages/Profile/Profile';
import { Admin }         from './pages/Admin/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Javne rute ── */}
        <Route path="/login" element={<Login />} />

        {/* ── Zaštićene rute (treba token) ── */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route index path="/"         element={<Dashboard />} />
            <Route path="/search"         element={<SearchResults />} />
            <Route path="/publish"        element={<PublishRide />} />
            <Route path="/profile"        element={<Profile />} />
          </Route>
        </Route>

        {/* ── Admin rute (treba token + admin role) ── */}
        <Route element={<PrivateRoute requireAdmin />}>
          <Route element={<MainLayout />}>
            <Route path="/admin"          element={<Admin />} />
          </Route>
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
