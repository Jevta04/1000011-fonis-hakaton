import { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { SearchForm }  from '../../components/rides/SearchForm/SearchForm';
import { RideCard }    from '../../components/rides/RideCard/RideCard';
import { getAvailableRides, joinRide } from '../../services/apiService';
import './Dashboard.css';

// Mock podaci za prikaz dok nema backend-a
const MOCK_RIDES = [
  {
    id: 1,
    from: 'Beograd',
    to: 'Novi Sad',
    date: '2026-04-10',
    time: '07:30',
    seats: 3,
    price: 500,
    driver: 'Marko Petrović',
    avatar: 'M',
    duration: '1h 15min',
    vehicle: 'Škoda Octavia',
  },
  {
    id: 2,
    from: 'Novi Sad',
    to: 'Beograd',
    date: '2026-04-10',
    time: '16:00',
    seats: 1,
    price: 500,
    driver: 'Ana Jovanović',
    avatar: 'A',
    duration: '1h 20min',
    vehicle: 'Toyota Corolla',
  },
  {
    id: 3,
    from: 'Beograd',
    to: 'Niš',
    date: '2026-04-11',
    time: '06:45',
    seats: 0,
    price: 1200,
    driver: 'Nikola Nikolić',
    avatar: 'N',
    duration: '2h 30min',
    vehicle: 'BMW Serija 3',
  },
];

export function Dashboard() {
  const { t } = useTranslation();
  const [rides, setRides]     = useState([]);
  const [loading, setLoading] = useState(true);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); }
    catch { return {}; }
  })();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await getAvailableRides({ limit: 5 });
        setRides(response.data?.data || response.data || []);
      } catch {
        // Ako API nije dostupan, prikaži mock podatke
        setRides(MOCK_RIDES);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  const handleJoin = async (rideId) => {
    try {
      await joinRide(rideId);
      setRides((prev) =>
        prev.map((r) =>
          r.id === rideId ? { ...r, seats: r.seats - 1 } : r
        )
      );
    } catch (err) {
      console.error('Greška pri prijavi:', err);
    }
  };

  return (
    <div className="dashboard page-enter">
      {/* Hero sekcija sa pretragom */}
      <section className="dashboard__hero">
        <div className="container">
          <div className="dashboard__hero-text">
            <h1 className="dashboard__greeting">
              {t('welcome_back')}, <span className="dashboard__name">{user?.name?.split(' ')[0] || '👋'}</span>
            </h1>
            <p className="dashboard__tagline">{t('tagline')}</p>
          </div>

          <div className="dashboard__search-card">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Dostupne vožnje */}
      <section className="dashboard__rides">
        <div className="container">
          <div className="dashboard__section-header">
            <h2 className="dashboard__section-title">{t('available_rides')}</h2>
            <a href="/search" className="dashboard__view-all">{t('view_all')}</a>
          </div>

          {loading ? (
            <div className="dashboard__loading" role="status">
              {[1, 2, 3].map((i) => (
                <div key={i} className="dashboard__skeleton" aria-hidden="true" />
              ))}
            </div>
          ) : rides.length === 0 ? (
            <div className="dashboard__empty">
              <span aria-hidden="true">🚗</span>
              <p>{t('no_rides_found')}</p>
            </div>
          ) : (
            <div className="dashboard__rides-list">
              {rides.map((ride) => (
                <RideCard
                  key={ride.id}
                  {...ride}
                  onJoin={() => handleJoin(ride.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
