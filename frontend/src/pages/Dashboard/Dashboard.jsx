import { useState, useEffect } from 'react';
import { Car, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { SearchForm }  from '../../components/rides/SearchForm/SearchForm';
import { RideCard }    from '../../components/rides/RideCard/RideCard';
import { getAvailableRides, joinRide } from '../../services/apiService';
import './Dashboard.css';

const MOCK_RIDES = [
  { id: 1, mestoOd: 'Bežanijska kosa', mestoDo: 'Novi Beograd (Ušće)', datumVreme: '2026-04-10T07:30:00', seats: 3, driver: 'Marko Petrović',  avatar: 'M', vehicle: 'Škoda Octavia',  smoking: false, music: true,  airCondition: true,  pets: false },
  { id: 2, mestoOd: 'Zemun centar',    mestoDo: 'Savski venac',        datumVreme: '2026-04-10T08:00:00', seats: 1, driver: 'Ana Jovanović',   avatar: 'A', vehicle: 'Toyota Corolla', smoking: false, music: false, airCondition: true,  pets: true  },
  { id: 3, mestoOd: 'Voždovac',        mestoDo: 'Novi Beograd (Ušće)', datumVreme: '2026-04-11T07:15:00', seats: 0, driver: 'Nikola Nikolić',  avatar: 'N', vehicle: 'BMW Serija 3',   smoking: true,  music: true,  airCondition: false, pets: false },
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
      setRides((prev) => prev.map((r) => r.id === rideId ? { ...r, seats: r.seats - 1 } : r));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard page-enter">
      {/* Hero */}
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

      {/* Vožnje */}
      <section className="dashboard__rides">
        <div className="container">
          <div className="dashboard__section-header">
            <h2 className="dashboard__section-title">{t('available_rides')}</h2>
            <a href="/search" className="dashboard__view-all">
              {t('view_all')} <ArrowRight size={14} />
            </a>
          </div>

          {loading ? (
            <div className="dashboard__loading">
              {[1, 2, 3].map((i) => <div key={i} className="dashboard__skeleton" aria-hidden="true" />)}
            </div>
          ) : rides.length === 0 ? (
            <div className="dashboard__empty">
              <Car size={48} strokeWidth={1} />
              <p>{t('no_rides_found')}</p>
            </div>
          ) : (
            <div className="dashboard__rides-list">
              {rides.map((ride) => (
                <RideCard key={ride.id} {...ride} onJoin={() => handleJoin(ride.id)} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
