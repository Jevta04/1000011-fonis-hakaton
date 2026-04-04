import { useState, useEffect } from 'react';
import { Car, Plus, Trash2, Pencil } from 'lucide-react';
import { useTranslation }      from '../../hooks/useTranslation';
import {
  getUserProfile, getRideHistory,
  getVehicles, createVehicle, updateVehicle, deleteVehicle,
} from '../../services/apiService';
import { RideCard }   from '../../components/rides/RideCard/RideCard';
import { Button }     from '../../components/common/Button/Button';
import { Input }      from '../../components/common/Input/Input';
import './Profile.css';

const VEHICLE_INIT = { marka: '', broj_tablica: '', boja: '', fuel_consumption_per_100km: '' };

export function Profile() {
  const { t } = useTranslation();
  const [profile, setProfile]     = useState(null);
  const [history, setHistory]     = useState([]);
  const [vehicles, setVehicles]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('driver');

  // Vehicle form state
  const [vForm, setVForm]           = useState(VEHICLE_INIT);
  const [editingId, setEditingId]   = useState(null);
  const [vErrors, setVErrors]       = useState({});
  const [vLoading, setVLoading]     = useState(false);
  const [showVForm, setShowVForm]   = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, historyRes, vehiclesRes] = await Promise.allSettled([
          getUserProfile(),
          getRideHistory(),
          getVehicles(),
        ]);
        if (profileRes.status === 'fulfilled') setProfile(profileRes.value.data);
        if (historyRes.status === 'fulfilled')
          setHistory(historyRes.value.data?.data || historyRes.value.data || []);
        if (vehiclesRes.status === 'fulfilled')
          setVehicles(vehiclesRes.value.data?.data || vehiclesRes.value.data || []);
      } catch {
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

  /* ── Vehicle CRUD ── */
  const openNew  = () => { setVForm(VEHICLE_INIT); setEditingId(null); setVErrors({}); setShowVForm(true); };
  const openEdit = (v) => { setVForm({ marka: v.marka || '', broj_tablica: v.broj_tablica || '', boja: v.boja || '', fuel_consumption_per_100km: v.fuel_consumption_per_100km || '' }); setEditingId(v.id); setVErrors({}); setShowVForm(true); };
  const closeForm = () => { setShowVForm(false); setEditingId(null); };

  const handleVSave = async () => {
    const errs = {};
    if (!vForm.marka.trim())        errs.marka         = t('field_required');
    if (!vForm.broj_tablica.trim()) errs.broj_tablica  = t('field_required');
    if (Object.keys(errs).length)   { setVErrors(errs); return; }

    setVLoading(true);
    try {
      if (editingId) {
        const res = await updateVehicle(editingId, vForm);
        setVehicles((p) => p.map((v) => v.id === editingId ? (res.data?.data || res.data || v) : v));
      } else {
        const res = await createVehicle(vForm);
        setVehicles((p) => [...p, res.data?.data || res.data]);
      }
      closeForm();
    } catch (err) { console.error(err); }
    finally { setVLoading(false); }
  };

  const handleVDelete = async (id) => {
    if (!window.confirm('Obrisati vozilo?')) return;
    try {
      await deleteVehicle(id);
      setVehicles((p) => p.filter((v) => v.id !== id));
    } catch (err) { console.error(err); }
  };

  const TABS = [
    { key: 'driver',    label: t('rides_as_driver'),    count: driverRides.length },
    { key: 'passenger', label: t('rides_as_passenger'), count: passengerRides.length },
    { key: 'vehicles',  label: t('vehicles'),           count: vehicles.length },
  ];

  return (
    <div className="profile page-enter">
      <div className="container">
        {/* Profil kartica */}
        <section className="profile__card">
          <div className="profile__avatar">
            {profile?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="profile__info">
            <h1 className="profile__name">{profile?.name || '—'}</h1>
            <p className="profile__email text-muted">{profile?.email || '—'}</p>
            <p className="profile__company text-muted">
              🏢 {profile?.company?.name || profile?.company || '—'}
            </p>
          </div>
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

        {/* Tabovi */}
        <section className="profile__history">
          <div className="profile__tabs" role="tablist">
            {TABS.map(({ key, label, count }) => (
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

          {/* Vozila tab */}
          {activeTab === 'vehicles' && (
            <div className="profile__vehicles" role="tabpanel">
              <div className="profile__vehicles-header">
                <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={openNew}>
                  {t('add_vehicle')}
                </Button>
              </div>

              {showVForm && (
                <div className="profile__vehicle-form">
                  <div className="profile__vehicle-form-row">
                    <Input
                      label={t('vehicle_brand')} placeholder={t('vehicle_brand_placeholder')}
                      value={vForm.marka}
                      onChange={(e) => setVForm((p) => ({ ...p, marka: e.target.value }))}
                      error={vErrors.marka} icon={<Car size={15} />} required
                    />
                    <Input
                      label={t('license_plate')} placeholder={t('license_plate_placeholder')}
                      value={vForm.broj_tablica}
                      onChange={(e) => setVForm((p) => ({ ...p, broj_tablica: e.target.value }))}
                      error={vErrors.broj_tablica} required
                    />
                  </div>
                  <div className="profile__vehicle-form-row">
                    <Input
                      label={t('vehicle_color')} placeholder={t('vehicle_color_placeholder')}
                      value={vForm.boja}
                      onChange={(e) => setVForm((p) => ({ ...p, boja: e.target.value }))}
                    />
                    <Input
                      label={t('fuel_consumption')} placeholder="npr. 6.5"
                      type="number" step="0.1" min="1" max="50"
                      value={vForm.fuel_consumption_per_100km}
                      onChange={(e) => setVForm((p) => ({ ...p, fuel_consumption_per_100km: e.target.value }))}
                    />
                  </div>
                  <div className="profile__vehicle-form-actions">
                    <Button variant="ghost" onClick={closeForm}>{t('cancel')}</Button>
                    <Button variant="primary" loading={vLoading} onClick={handleVSave}>{t('save')}</Button>
                  </div>
                </div>
              )}

              {vehicles.length === 0 && !showVForm ? (
                <div className="profile__empty">
                  <span aria-hidden="true">🚗</span>
                  <p>{t('no_vehicles')}</p>
                </div>
              ) : (
                <ul className="profile__vehicle-list">
                  {vehicles.map((v) => (
                    <li key={v.id} className="profile__vehicle-item">
                      <Car size={20} className="profile__vehicle-icon" />
                      <div className="profile__vehicle-info">
                        <span className="profile__vehicle-brand">{v.marka}</span>
                        <span className="profile__vehicle-sub text-muted">
                          {v.broj_tablica}{v.boja ? ` · ${v.boja}` : ''}{v.fuel_consumption_per_100km ? ` · ${v.fuel_consumption_per_100km} L/100km` : ''}
                        </span>
                      </div>
                      <div className="profile__vehicle-actions">
                        <button className="profile__vehicle-btn" onClick={() => openEdit(v)} title={t('edit')}>
                          <Pencil size={14} />
                        </button>
                        <button className="profile__vehicle-btn profile__vehicle-btn--danger" onClick={() => handleVDelete(v.id)} title={t('delete')}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Rides tabs */}
          {activeTab !== 'vehicles' && (
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
          )}
        </section>
      </div>
    </div>
  );
}
