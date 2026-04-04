import axios from 'axios';

/* ============================================================
   AXIOS INSTANCA
   baseURL se proxy-uje na Laravel backend (vite.config.js)
   ============================================================ */
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/* ---- REQUEST interceptor – dodaje Bearer token ---- */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ---- RESPONSE interceptor – hvata greške globalno ---- */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token istekao ili nevalidan – obriši lokalno, PrivateRoute radi redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    if (error.response?.status === 403) {
      console.error('[API] Nedovoljne privilegije za ovu akciju.');
    }

    if (!error.response) {
      // Mrežna greška (server nedostupan)
      console.error('[API] Mrežna greška:', error.message);
    }

    return Promise.reject(error);
  }
);

/* ============================================================
   AUTH ENDPOINTS
   ============================================================ */

/** POST /auth/login */
export const login = (email, password) =>
  api.post('/auth/login', { email, password });

/** POST /auth/logout */
export const logout = () =>
  api.post('/auth/logout');

/**
 * POST /auth/register
 * Šalje FormData (multipart) zbog opcione slike.
 * @param {FormData} formData – ime, prezime, email, password, broj_telefona, uloga, slika?
 */
export const register = (formData) =>
  api.post('/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

/* ============================================================
   RIDES (VOŽNJE) ENDPOINTS
   ============================================================ */

/**
 * GET /rides
 * @param {Object} params – mestoOd, mestoDo, date, seats
 */
export const getAvailableRides = (params = {}) =>
  api.get('/rides', { params });

/** GET /rides/:id */
export const getRideById = (id) =>
  api.get(`/rides/${id}`);

/**
 * POST /rides
 * @param {Object} data – { mestoOd, mestoDo, datumVreme, seats, smoking, music,
 *                          airCondition, pets, luggage, vozilo: { broj_tablica, marka, boja } }
 */
export const publishRide = (data) =>
  api.post('/rides', data);

/**
 * PUT /rides/:id
 */
export const updateRide = (id, data) =>
  api.put(`/rides/${id}`, data);

/**
 * DELETE /rides/:id
 */
export const deleteRide = (id) =>
  api.delete(`/rides/${id}`);

/**
 * POST /rides/:id/join
 */
export const joinRide = (rideId) =>
  api.post(`/rides/${rideId}/join`);

/**
 * POST /rides/:id/leave
 */
export const leaveRide = (rideId) =>
  api.post(`/rides/${rideId}/leave`);

/* ============================================================
   USER (KORISNIK) ENDPOINTS
   ============================================================ */

/** GET /user/profile */
export const getUserProfile = () =>
  api.get('/user/profile');

/** PUT /user/profile */
export const updateUserProfile = (data) =>
  api.put('/user/profile', data);

/**
 * GET /user/rides – istorija vožnji ulogovanog korisnika
 */
export const getRideHistory = () =>
  api.get('/user/rides');

/* ============================================================
   ADMIN ENDPOINTS
   ============================================================ */

/** GET /admin/users */
export const adminGetUsers = (params = {}) =>
  api.get('/admin/users', { params });

/** GET /admin/users/:id */
export const adminGetUser = (id) =>
  api.get(`/admin/users/${id}`);

/** PUT /admin/users/:id/approve */
export const adminApproveUser = (id) =>
  api.put(`/admin/users/${id}/approve`);

/** DELETE /admin/users/:id */
export const adminDeleteUser = (id) =>
  api.delete(`/admin/users/${id}`);

/** GET /admin/rides */
export const adminGetAllRides = (params = {}) =>
  api.get('/admin/rides', { params });

/** GET /companies – javni endpoint za listu kompanija */
export const getCompanies = () =>
  api.get('/companies');

/** POST /companies – kreiranje nove kompanije */
export const createCompany = (data) =>
  api.post('/companies', data);

/** GET /admin/companies */
export const adminGetCompanies = () =>
  api.get('/admin/companies');

/** GET /admin/stats */
export const adminGetStats = () =>
  api.get('/admin/stats');

/* ============================================================
   EKSPORT – sirova Axios instanca (za custom pozive)
   ============================================================ */
export default api;
