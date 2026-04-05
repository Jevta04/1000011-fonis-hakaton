import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    if (error.response?.status === 403) {
      console.error('[API] Nedovoljne privilegije.');
    }
    if (!error.response) {
      console.error('[API] Mrežna greška:', error.message);
    }
    return Promise.reject(error);
  }
);

/* ============================================================
   AUTH
   ============================================================ */
export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const logout = () =>
  api.post('/auth/logout');

export const register = (formData) =>
  api.post('/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getMe = () =>
  api.get('/auth/me');

/* ============================================================
   RIDES
   ============================================================ */
/**
 * GET /rides
 * Params: mestoOd, mestoDo, date, departure_lat, departure_lng,
 *         arrival_lat, arrival_lng, radius_m, limit
 */
export const getAvailableRides = (params = {}) =>
  api.get('/rides', { params });

export const getRideById = (id) =>
  api.get(`/rides/${id}`);

/**
 * POST /rides
 * data: { mestoOd, mestoDo, departure_lat, departure_lng, arrival_lat, arrival_lng,
 *         distance_km, fuel_price_per_liter, datumVreme, seats, smoking, music,
 *         airCondition, vozilo: { broj_tablica, marka, boja, fuel_consumption } }
 */
export const publishRide = (data) =>
  api.post('/rides', data);

export const updateRide = (id, data) =>
  api.put(`/rides/${id}`, data);

export const deleteRide = (id) =>
  api.delete(`/rides/${id}`);

export const joinRide = (rideId) =>
  api.post(`/rides/${rideId}/join`);

export const leaveRide = (rideId) =>
  api.post(`/rides/${rideId}/leave`);

/* ============================================================
   PASSENGERS
   ============================================================ */
export const getRidePassengers = (rideId) =>
  api.get(`/rides/${rideId}/passengers`);

export const confirmPassenger = (rideId, passengerId) =>
  api.patch(`/rides/${rideId}/passengers/${passengerId}/confirm`);

export const rejectPassenger = (rideId, passengerId) =>
  api.patch(`/rides/${rideId}/passengers/${passengerId}/reject`);

/* ============================================================
   VEHICLES
   ============================================================ */
export const getVehicles = () =>
  api.get('/vehicles');

export const createVehicle = (data) =>
  api.post('/vehicles', data);

export const updateVehicle = (id, data) =>
  api.put(`/vehicles/${id}`, data);

export const deleteVehicle = (id) =>
  api.delete(`/vehicles/${id}`);

/* ============================================================
   USER
   ============================================================ */
export const getUserProfile = () =>
  api.get('/user/profile');

export const updateUserProfile = (data) =>
  api.put('/user/profile', data);

export const getRideHistory = () =>
  api.get('/user/rides');

/* ============================================================
   COMPANIES
   ============================================================ */
export const getCompanies = () =>
  api.get('/companies');

export const createCompany = (data) =>
  api.post('/companies', data);

/* ============================================================
   ADMIN
   ============================================================ */
export const adminGetUsers = (params = {}) =>
  api.get('/admin/users', { params });

export const adminDeleteUser = (id) =>
  api.delete(`/admin/users/${id}`);

export const adminGetAllRides = (params = {}) =>
  api.get('/admin/rides', { params });

export const adminDeleteRide = (id) =>
  api.delete(`/admin/rides/${id}`);

export const adminGetStats = () =>
  api.get('/admin/stats');

export const adminGetCompanies = () =>
  api.get('/admin/companies');

export const adminUpdateUser = (id, data) =>
  api.put(`/admin/users/${id}`, data);

export const adminUpdateRide = (id, data) =>
  api.put(`/admin/rides/${id}`, data);

export const adminGetCharts = () =>
  api.get('/admin/charts');

/* ============================================================
   OSRM — kalkulacija rute (poziva se direktno sa frontenda)
   ============================================================ */
export async function calculateRoute(depLat, depLng, arrLat, arrLng) {
  const url = `https://router.project-osrm.org/route/v1/driving/${depLng},${depLat};${arrLng},${arrLat}?overview=full&geometries=geojson`;
  const res  = await fetch(url);
  const data = await res.json();
  if (!data.routes?.[0]) throw new Error('OSRM: no route found');
  return {
    distanceKm:  data.routes[0].distance / 1000,
    durationMin: Math.round(data.routes[0].duration / 60),
    geometry:    data.routes[0].geometry,
  };
}

export default api;
