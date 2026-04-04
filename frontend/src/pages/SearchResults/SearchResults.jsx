import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation }    from '../../hooks/useTranslation';
import { SearchForm }        from '../../components/rides/SearchForm/SearchForm';
import { RideCard }          from '../../components/rides/RideCard/RideCard';
import { getAvailableRides, joinRide } from '../../services/apiService';
import './SearchResults.css';

export function SearchResults() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [rides, setRides]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const currentQuery = {
    from:  searchParams.get('from')  || '',
    to:    searchParams.get('to')    || '',
    date:  searchParams.get('date')  || '',
    seats: searchParams.get('seats') || '1',
  };

  useEffect(() => {
    if (!currentQuery.from && !currentQuery.to) return;
    fetchRides(currentQuery);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const fetchRides = async (params) => {
    setLoading(true);
    setSearched(true);
    try {
      const response = await getAvailableRides(params);
      setRides(response.data?.data || response.data || []);
    } catch {
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (formData) => {
    const params = new URLSearchParams(formData);
    setSearchParams(params);
  };

  const handleJoin = async (rideId) => {
    try {
      await joinRide(rideId);
      setRides((prev) =>
        prev.map((r) => r.id === rideId ? { ...r, seats: r.seats - 1 } : r)
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="search-results page-enter">
      <div className="container">
        {/* Kompaktna search forma na vrhu */}
        <section className="search-results__form-section">
          <SearchForm onSearch={handleSearch} compact />
        </section>

        {/* Rezultati */}
        <section className="search-results__content">
          {currentQuery.from && currentQuery.to && (
            <div className="search-results__header">
              <h1 className="search-results__title">
                {currentQuery.from}
                <span className="search-results__arrow" aria-hidden="true"> → </span>
                {currentQuery.to}
              </h1>
              {!loading && searched && (
                <span className="search-results__count">
                  {rides.length} {t('available_rides').toLowerCase()}
                </span>
              )}
            </div>
          )}

          {loading ? (
            <div className="search-results__loading" role="status">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="search-results__skeleton" aria-hidden="true" />
              ))}
            </div>
          ) : searched && rides.length === 0 ? (
            <div className="search-results__empty">
              <span aria-hidden="true">🔍</span>
              <h2>{t('no_rides_found')}</h2>
              <p className="text-muted">
                {currentQuery.from} → {currentQuery.to}
              </p>
            </div>
          ) : (
            <div className="search-results__list">
              {rides.map((ride) => (
                <RideCard
                  key={ride.id}
                  {...ride}
                  onJoin={() => handleJoin(ride.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
