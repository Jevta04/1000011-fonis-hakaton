import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Flag, Calendar, Search as SearchIcon, ArrowRight, Navigation, Clock } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { AddressAutocomplete } from '../../components/map/AddressAutocomplete';
import { MapPicker }           from '../../components/map/MapPicker';
import { RideCard }   from '../../components/rides/RideCard/RideCard';
import { Button }     from '../../components/common/Button/Button';
import { Input }      from '../../components/common/Input/Input';
import { getAvailableRides, joinRide, leaveRide, deleteRide } from '../../services/apiService';
import './SearchResults.css';

export function SearchResults() {
  const { t }     = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [form, setForm] = useState({
    mestoOd: searchParams.get('mestoOd') || '',
    mestoDo: searchParams.get('mestoDo') || '',
    date:    searchParams.get('date')    || '',
    departure_lat: searchParams.get('departure_lat') ? parseFloat(searchParams.get('departure_lat')) : null,
    departure_lng: searchParams.get('departure_lng') ? parseFloat(searchParams.get('departure_lng')) : null,
    arrival_lat:   searchParams.get('arrival_lat')   ? parseFloat(searchParams.get('arrival_lat'))   : null,
    arrival_lng:   searchParams.get('arrival_lng')   ? parseFloat(searchParams.get('arrival_lng'))   : null,
  });

  const [rides, setRides]         = useState([]);
  const [nearbyRides, setNearbyRides] = useState([]);
  const [earliestRides, setEarliestRides] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [defaultLoading, setDefaultLoading] = useState(true);
  const [searched, setSearched]   = useState(false);
  const [mapOpen, setMapOpen]     = useState(false);
  const [mapTarget, setMapTarget] = useState(null);

  // Učitaj defaultni prikaz (bez pretrage)
  useEffect(() => {
    const loadDefault = async (userLat, userLng) => {
      try {
        const [nearbyRes, earliestRes] = await Promise.all([
          userLat
            ? getAvailableRides({ limit: 5, user_lat: userLat, user_lng: userLng })
            : Promise.resolve({ data: [] }),
          getAvailableRides({ limit: 5 }),
        ]);
        setNearbyRides(userLat ? (nearbyRes.data?.data || nearbyRes.data || []) : []);
        setEarliestRides(earliestRes.data?.data || earliestRes.data || []);
      } catch {
        setNearbyRides([]);
        setEarliestRides([]);
      } finally {
        setDefaultLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => loadDefault(coords.latitude, coords.longitude),
        () => loadDefault(null, null),
        { timeout: 3000 }
      );
    } else {
      loadDefault(null, null);
    }
  }, []);

  // Pretraga iz URL parametara
  useEffect(() => {
    const mo = searchParams.get('mestoOd');
    const md = searchParams.get('mestoDo');
    if (!mo && !md) return;
    fetchRides();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const fetchRides = async (overrideForm) => {
    const f = overrideForm || form;
    setLoading(true);
    setSearched(true);
    try {
      const params = {
        mestoOd: f.mestoOd || undefined,
        mestoDo: f.mestoDo || undefined,
        date:    f.date    || undefined,
      };
      if (f.departure_lat && f.departure_lng) {
        params.departure_lat = f.departure_lat;
        params.departure_lng = f.departure_lng;
      }
      if (f.arrival_lat && f.arrival_lng) {
        params.arrival_lat = f.arrival_lat;
        params.arrival_lng = f.arrival_lng;
      }
      const response = await getAvailableRides(params);
      setRides(response.data?.data || response.data || []);
    } catch {
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.mestoOd)       params.set('mestoOd', form.mestoOd);
    if (form.mestoDo)       params.set('mestoDo', form.mestoDo);
    if (form.date)          params.set('date', form.date);
    if (form.departure_lat) params.set('departure_lat', form.departure_lat);
    if (form.departure_lng) params.set('departure_lng', form.departure_lng);
    if (form.arrival_lat)   params.set('arrival_lat', form.arrival_lat);
    if (form.arrival_lng)   params.set('arrival_lng', form.arrival_lng);
    setSearchParams(params);
    fetchRides(form);
  };

  const handleLocSelect = (prefix) => ({ address, lat, lng }) => {
    setForm((p) => prefix === 'dep'
      ? { ...p, mestoOd: address, departure_lat: lat, departure_lng: lng }
      : { ...p, mestoDo: address, arrival_lat: lat, arrival_lng: lng }
    );
  };

  const handleMapSelect = ({ address, lat, lng }) => {
    handleLocSelect(mapTarget)({ address, lat, lng });
  };

  const patchRides = (setter, rideId, patch) =>
    setter((prev) => prev.map((r) => r.id === rideId ? { ...r, ...patch } : r));

  const removeRide = (rideId) => {
    setRides((p) => p.filter((r) => r.id !== rideId));
    setNearbyRides((p) => p.filter((r) => r.id !== rideId));
    setEarliestRides((p) => p.filter((r) => r.id !== rideId));
  };

  const handleJoin = async (rideId) => {
    try {
      await joinRide(rideId);
      const patch = { isJoined: true };
      patchRides(setRides, rideId, patch);
      patchRides(setNearbyRides, rideId, patch);
      patchRides(setEarliestRides, rideId, patch);
    } catch (err) { console.error(err); }
  };

  const handleLeave = async (rideId) => {
    try {
      await leaveRide(rideId);
      const patch = { isJoined: false };
      patchRides(setRides, rideId, patch);
      patchRides(setNearbyRides, rideId, patch);
      patchRides(setEarliestRides, rideId, patch);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (rideId) => {
    try {
      await deleteRide(rideId);
      removeRide(rideId);
    } catch (err) { console.error(err); }
  };

  const rideCardProps = (ride) => ({
    ...ride,
    onJoin:   () => handleJoin(ride.id),
    onLeave:  () => handleLeave(ride.id),
    onDelete: () => handleDelete(ride.id),
  });

  return (
    <div className="search-results page-enter">
      <div className="container">
        {/* Search forma */}
        <section className="search-results__form-section">
          <form className="search-results__form" onSubmit={handleSearch}>
            <AddressAutocomplete
              placeholder={t('from_placeholder')}
              value={form.mestoOd}
              onChange={(v) => setForm((p) => ({ ...p, mestoOd: v, departure_lat: null, departure_lng: null }))}
              onSelect={handleLocSelect('dep')}
              onMapClick={() => { setMapTarget('dep'); setMapOpen(true); }}
              icon={<MapPin size={15} />}
            />
            <span className="search-results__form-arrow" aria-hidden="true">
              <ArrowRight size={18} strokeWidth={2} />
            </span>
            <AddressAutocomplete
              placeholder={t('to_placeholder')}
              value={form.mestoDo}
              onChange={(v) => setForm((p) => ({ ...p, mestoDo: v, arrival_lat: null, arrival_lng: null }))}
              onSelect={handleLocSelect('arr')}
              onMapClick={() => { setMapTarget('arr'); setMapOpen(true); }}
              icon={<Flag size={15} />}
            />
            <Input
              name="date" type="date"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              icon={<Calendar size={15} />}
            />
            <Button type="submit" variant="primary" icon={<SearchIcon size={15} />}>
              {t('search')}
            </Button>
          </form>
        </section>

        {/* Rezultati pretrage */}
        {searched ? (
          <section className="search-results__content">
            {form.mestoOd && form.mestoDo && (
              <div className="search-results__header">
                <h1 className="search-results__title">
                  {form.mestoOd}
                  <span className="search-results__arrow" aria-hidden="true"> → </span>
                  {form.mestoDo}
                </h1>
                {!loading && (
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
            ) : rides.length === 0 ? (
              <div className="search-results__empty">
                <span aria-hidden="true">🔍</span>
                <h2>{t('no_rides_found')}</h2>
              </div>
            ) : (
              <div className="search-results__list">
                {rides.map((ride) => (
                  <RideCard key={ride.id} {...rideCardProps(ride)} />
                ))}
              </div>
            )}
          </section>
        ) : (
          /* Default prikaz — bez pretrage */
          <section className="search-results__default">
            {defaultLoading ? (
              <div className="search-results__loading" role="status">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="search-results__skeleton" aria-hidden="true" />
                ))}
              </div>
            ) : (
              <>
                {nearbyRides.length > 0 && (
                  <div className="search-results__section">
                    <h2 className="search-results__section-title">
                      <Navigation size={16} /> Najbliže vama
                    </h2>
                    <div className="search-results__list">
                      {nearbyRides.map((ride) => (
                        <RideCard key={ride.id} {...rideCardProps(ride)} />
                      ))}
                    </div>
                  </div>
                )}

                {earliestRides.length > 0 && (
                  <div className="search-results__section">
                    <h2 className="search-results__section-title">
                      <Clock size={16} /> Najranije vožnje
                    </h2>
                    <div className="search-results__list">
                      {earliestRides.map((ride) => (
                        <RideCard key={ride.id} {...rideCardProps(ride)} />
                      ))}
                    </div>
                  </div>
                )}

                {nearbyRides.length === 0 && earliestRides.length === 0 && (
                  <div className="search-results__empty">
                    <span aria-hidden="true">🚗</span>
                    <h2>{t('no_rides_found')}</h2>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </div>

      <MapPicker
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        onSelect={handleMapSelect}
        title={mapTarget === 'dep' ? 'Odaberi polazak' : 'Odaberi dolazak'}
      />
    </div>
  );
}
