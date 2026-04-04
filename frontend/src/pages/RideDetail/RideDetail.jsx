import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Flag, Calendar, Users, Car, Route,
  Coins, Cigarette, Music, Wind, Check, X, Clock,
  ChevronLeft, Trash2,
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import {
  getRideById, getRidePassengers, joinRide, leaveRide,
  confirmPassenger, rejectPassenger, deleteRide,
} from '../../services/apiService';
import { Button } from '../../components/common/Button/Button';
import './RideDetail.css';

function statusBadge(status) {
  const map = { pending: 'warning', confirmed: 'success', rejected: 'error', cancelled: 'muted' };
  return map[status] || 'muted';
}

export function RideDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { t }     = useTranslation();

  const [ride, setRide]             = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [actionLoading, setAL]      = useState(false);

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();

  const isDriver    = ride && currentUser && ride.driverId === currentUser.id;
  const myPassenger = passengers.find((p) => p.id === currentUser?.id);
  const isPassenger = !!myPassenger;

  const reloadRide = async () => {
    const [rideRes, passRes] = await Promise.all([
      getRideById(id),
      getRidePassengers(id),
    ]);
    setRide(rideRes.data?.data || rideRes.data);
    setPassengers(passRes.data?.data || passRes.data || []);
  };

  useEffect(() => {
    const load = async () => {
      try { await reloadRide(); }
      catch { setRide(null); }
      finally { setLoading(false); }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleJoin = async () => {
    setAL(true);
    try { await joinRide(id); await reloadRide(); }
    catch (err) { console.error(err); }
    finally { setAL(false); }
  };

  const handleLeave = async () => {
    setAL(true);
    try { await leaveRide(id); await reloadRide(); }
    catch (err) { console.error(err); }
    finally { setAL(false); }
  };

  const handleConfirm = async (passengerId) => {
    setAL(true);
    try {
      await confirmPassenger(id, passengerId);
      setPassengers((prev) =>
        prev.map((p) => p.id === passengerId ? { ...p, status: 'confirmed' } : p)
      );
      const rRes = await getRideById(id);
      setRide(rRes.data?.data || rRes.data);
    } catch (err) { console.error(err); }
    finally { setAL(false); }
  };

  const handleReject = async (passengerId) => {
    setAL(true);
    try {
      await rejectPassenger(id, passengerId);
      setPassengers((prev) =>
        prev.map((p) => p.id === passengerId ? { ...p, status: 'rejected' } : p)
      );
    } catch (err) { console.error(err); }
    finally { setAL(false); }
  };

  const handleCancelRide = async () => {
    if (!window.confirm('Otkazati vožnju? Svi putnici će biti odjavljeni.')) return;
    setAL(true);
    try {
      await deleteRide(id);
      navigate('/');
    } catch (err) { console.error(err); }
    finally { setAL(false); }
  };

  if (loading) {
    return (
      <div className="ride-detail page-enter">
        <div className="container">
          <div className="ride-detail__skeleton" />
        </div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="ride-detail page-enter">
        <div className="container">
          <div className="ride-detail__not-found">
            <span aria-hidden="true">🔍</span>
            <h2>{t('ride_not_found')}</h2>
            <Button variant="ghost" onClick={() => navigate(-1)} icon={<ChevronLeft size={16} />}>
              {t('back')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const options = [
    ride.smoking      && { Icon: Cigarette, label: t('smoking') },
    ride.music        && { Icon: Music,     label: t('music') },
    ride.airCondition && { Icon: Wind,      label: t('air_condition') },
  ].filter(Boolean);

  const myStatus = myPassenger?.status || null;

  return (
    <div className="ride-detail page-enter">
      <div className="container">
        <button className="ride-detail__back" onClick={() => navigate(-1)}>
          <ChevronLeft size={18} /> {t('back')}
        </button>

        <div className="ride-detail__layout">
          {/* ── Left: info ── */}
          <div className="ride-detail__main">
            {/* Route card */}
            <section className="ride-detail__card">
              <div className="ride-detail__route">
                <div className="ride-detail__route-point">
                  <MapPin size={18} className="ride-detail__route-icon ride-detail__route-icon--from" />
                  <div>
                    <span className="ride-detail__route-label">{t('from')}</span>
                    <span className="ride-detail__route-place">{ride.mestoOd || ride.from}</span>
                  </div>
                </div>
                <div className="ride-detail__route-line" aria-hidden="true" />
                <div className="ride-detail__route-point">
                  <Flag size={18} className="ride-detail__route-icon ride-detail__route-icon--to" />
                  <div>
                    <span className="ride-detail__route-label">{t('to')}</span>
                    <span className="ride-detail__route-place">{ride.mestoDo || ride.to}</span>
                  </div>
                </div>
              </div>

              <div className="ride-detail__meta">
                <div className="ride-detail__meta-item">
                  <Calendar size={15} />
                  <span>{ride.datumVreme}</span>
                </div>
                {ride.distance_km && (
                  <div className="ride-detail__meta-item">
                    <Route size={15} />
                    <span>{parseFloat(ride.distance_km).toFixed(1)} km</span>
                  </div>
                )}
                <div className="ride-detail__meta-item">
                  <Users size={15} />
                  <span>{ride.seats} {t('seats_available')}</span>
                </div>
                {(ride.price_per_seat > 0) && (
                  <div className="ride-detail__meta-item ride-detail__meta-item--price">
                    <Coins size={15} />
                    <span>{ride.price_per_seat} din / osobi</span>
                  </div>
                )}
              </div>
            </section>

            {/* Driver card */}
            <section className="ride-detail__card">
              <h3 className="ride-detail__section-title"><Car size={16} /> {t('driver')}</h3>
              <div className="ride-detail__driver">
                <div className="ride-detail__driver-avatar">
                  {ride.driver?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="ride-detail__driver-name">{ride.driver}</p>
                  {(ride.vehicle || ride.boja) && (
                    <p className="ride-detail__driver-vehicle text-muted">
                      {[ride.vehicle, ride.boja].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
              </div>

              {/* Driver: cancel button */}
              {isDriver && (
                <div className="ride-detail__driver-actions">
                  <Button
                    variant="ghost"
                    loading={actionLoading}
                    onClick={handleCancelRide}
                    icon={<Trash2 size={15} />}
                    className="ride-detail__cancel-btn"
                  >
                    {t('cancel_ride')}
                  </Button>
                </div>
              )}
            </section>

            {/* Options */}
            {options.length > 0 && (
              <section className="ride-detail__card">
                <h3 className="ride-detail__section-title">{t('ride_options')}</h3>
                <div className="ride-detail__options">
                  {options.map(({ Icon, label }) => (
                    <span key={label} className="ride-detail__option">
                      <Icon size={14} /> {label}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Right: actions + passengers ── */}
          <div className="ride-detail__sidebar">
            {/* Action area — hidden for driver */}
            {!isDriver && (
              <section className="ride-detail__card ride-detail__action-card">
                {/* Status badge when already joined */}
                {isPassenger && (
                  <div className={`ride-detail__status-badge ride-detail__status-badge--${statusBadge(myStatus)}`}>
                    {myStatus === 'confirmed' && <Check size={14} />}
                    {myStatus === 'rejected'  && <X size={14} />}
                    {myStatus === 'pending'   && <Clock size={14} />}
                    {t(myStatus || 'pending')}
                  </div>
                )}

                {/* Join button — always visible, greyed when already joined */}
                <Button
                  variant="primary"
                  loading={actionLoading && !isPassenger}
                  onClick={!isPassenger ? handleJoin : undefined}
                  disabled={isPassenger || ride.seats <= 0}
                  icon={<Users size={16} />}
                >
                  {ride.seats <= 0 ? t('ride_full') : t('join_ride')}
                </Button>

                {/* Leave button — only when joined */}
                {isPassenger && (
                  <Button variant="ghost" loading={actionLoading} onClick={handleLeave}>
                    {t('leave_ride')}
                  </Button>
                )}
              </section>
            )}

            {/* Passenger list */}
            <section className="ride-detail__card">
              <h3 className="ride-detail__section-title">
                <Users size={16} /> {t('passengers_list')}
              </h3>
              {passengers.length === 0 ? (
                <p className="ride-detail__no-passengers text-muted">{t('no_results')}</p>
              ) : (
                <ul className="ride-detail__passengers">
                  {passengers.map((p) => {
                    const status = p.status || 'pending';
                    return (
                      <li key={p.id} className="ride-detail__passenger">
                        <div className="ride-detail__passenger-avatar">
                          {p.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="ride-detail__passenger-info">
                          <span className="ride-detail__passenger-name">{p.name}</span>
                          {isDriver && p.email && (
                            <span className="ride-detail__passenger-email text-muted">{p.email}</span>
                          )}
                        </div>
                        <span className={`ride-detail__passenger-status ride-detail__passenger-status--${statusBadge(status)}`}>
                          {t(status)}
                        </span>
                        {isDriver && status === 'pending' && (
                          <div className="ride-detail__passenger-actions">
                            <button
                              className="ride-detail__icon-btn ride-detail__icon-btn--confirm"
                              onClick={() => handleConfirm(p.id)}
                              disabled={actionLoading}
                              title={t('confirm_passenger')}
                            >
                              <Check size={14} />
                            </button>
                            <button
                              className="ride-detail__icon-btn ride-detail__icon-btn--reject"
                              onClick={() => handleReject(p.id)}
                              disabled={actionLoading}
                              title={t('reject_passenger')}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
