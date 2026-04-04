import { useState, useEffect } from 'react';
import { useTranslation }      from '../../hooks/useTranslation';
import { getUserProfile, getRideHistory } from '../../services/apiService';
import { RideCard }   from '../../components/rides/RideCard/RideCard';
import { formatDate } from '../../utils/helpers';
import './Profile.css';

export function Profile() {
  const { t } = useTranslation();
  const [profile, setProfile]   = useState(null);
  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('driver');

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, historyRes] = await Promise.all([
          getUserProfile(),
          getRideHistory(),
        ]);
        setProfile(profileRes.data);
        setHistory(historyRes.data?.data || historyRes.data || []);
      } catch {
        // Fallback: učitaj iz localStorage
        const stored = localStorage.getItem('user');
        if (stored) setProfile(JSON.parse(stored));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="profile page-enter">
        <div className="container">
          <div className="profile__skeleton" aria-hidden="true" />
        </div>
      </div>
    );
  }

  const driverRides    = history.filter((r) => r.role === 'driver');
  const passengerRides = history.filter((r) => r.role === 'passenger');

  return (
    <div className="profile page-enter">
      <div className="container">
        {/* Profil kartica */}
        <section className="profile__card">
          {/* Avatar */}
          <div className="profile__avatar">
            {profile?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>

          {/* Info */}
          <div className="profile__info">
            <h1 className="profile__name">{profile?.name || '—'}</h1>
            <p className="profile__email text-muted">{profile?.email || '—'}</p>
            <p className="profile__company text-muted">
              🏢 {profile?.company?.name || profile?.company || '—'}
            </p>
          </div>

          {/* Stats */}
          <div className="profile__stats">
            <div className="profile__stat">
              <span className="profile__stat-value">{driverRides.length}</span>
              <span className="profile__stat-label">{t('rides_as_driver')}</span>
            </div>
            <div className="profile__stat">
              <span className="profile__stat-value">{passengerRides.length}</span>
              <span className="profile__stat-label">{t('rides_as_passenger')}</span>
            </div>
          </div>
        </section>

        {/* Istorija vožnji */}
        <section className="profile__history">
          <h2 className="profile__history-title">{t('ride_history')}</h2>

          {/* Tabovi */}
          <div className="profile__tabs" role="tablist">
            {[
              { key: 'driver',    label: t('rides_as_driver'),    count: driverRides.length },
              { key: 'passenger', label: t('rides_as_passenger'), count: passengerRides.length },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                role="tab"
                aria-selected={activeTab === key}
                className={`profile__tab ${activeTab === key ? 'profile__tab--active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {label} ({count})
              </button>
            ))}
          </div>

          {/* Lista vožnji */}
          <div className="profile__rides-list" role="tabpanel">
            {(activeTab === 'driver' ? driverRides : passengerRides).length === 0 ? (
              <div className="profile__empty">
                <span aria-hidden="true">📋</span>
                <p>{t('no_rides_found')}</p>
              </div>
            ) : (
              (activeTab === 'driver' ? driverRides : passengerRides).map((ride) => (
                <RideCard key={ride.id} {...ride} compact />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
