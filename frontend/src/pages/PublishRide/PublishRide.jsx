import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Flag, Calendar, Car, Hash, Palette,
  ChevronRight, ChevronLeft, Check, Cigarette, Music,
  Wind, Route, Fuel, Coins, Users, AlertCircle,
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { publishRide, calculateRoute } from '../../services/apiService';
import { AddressAutocomplete } from '../../components/map/AddressAutocomplete';
import { MapPicker }           from '../../components/map/MapPicker';
import { Input }  from '../../components/common/Input/Input';
import { Button } from '../../components/common/Button/Button';
import './PublishRide.css';

const STEPS = ['publish_step1', 'publish_step2', 'publish_step3', 'publish_step4'];

const INITIAL = {
  // Korak 1 – Ruta
  mestoOd: '',     departure_lat: null, departure_lng: null,
  mestoDo: '',     arrival_lat: null,   arrival_lng: null,
  distance_km: null, duration_min: null,
  // Korak 2 – Vreme i vozilo
  datumVreme: '', seats: 4,
  marka: '', broj_tablica: '', boja: '', fuel_consumption: '',
  // Korak 3 – Uslovi
  fuel_price_per_liter: '',
  smoking: false, music: true, airCondition: true,
};

export function PublishRide() {
  const { t }    = useTranslation();
  const navigate = useNavigate();

  const [step, setStep]         = useState(0);
  const [form, setForm]         = useState(INITIAL);
  const [loading, setLoading]   = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);
  const [errors, setErrors]     = useState({});
  const [routeError, setRouteError] = useState('');

  // MapPicker state
  const [mapOpen, setMapOpen]   = useState(false);
  const [mapTarget, setMapTarget] = useState(null); // 'dep' | 'arr'

  const set = (field, val) => {
    setForm((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  const handleToggle = (name) => setForm((p) => ({ ...p, [name]: !p[name] }));

  // Nominatim select handler
  const handleLocSelect = (prefix) => ({ address, lat, lng }) => {
    if (prefix === 'dep') {
      setForm((p) => ({ ...p, mestoOd: address, departure_lat: lat, departure_lng: lng }));
    } else {
      setForm((p) => ({ ...p, mestoDo: address, arrival_lat: lat, arrival_lng: lng }));
    }
    setErrors((p) => ({ ...p, [prefix === 'dep' ? 'mestoOd' : 'mestoDo']: '' }));
  };

  // MapPicker confirm
  const handleMapSelect = ({ address, lat, lng }) => {
    if (mapTarget === 'dep') {
      setForm((p) => ({ ...p, mestoOd: address, departure_lat: lat, departure_lng: lng }));
    } else {
      setForm((p) => ({ ...p, mestoDo: address, arrival_lat: lat, arrival_lng: lng }));
    }
  };

  // OSRM kalkulacija rute
  const calcRoute = async () => {
    if (!form.departure_lat || !form.arrival_lat) {
      setRouteError('Odaberi adrese sa mape ili autocomplete-a za kalkulaciju rute.');
      return;
    }
    setCalcLoading(true);
    setRouteError('');
    try {
      const { distanceKm, durationMin } = await calculateRoute(
        form.departure_lat, form.departure_lng,
        form.arrival_lat,   form.arrival_lng,
      );
      setForm((p) => ({ ...p, distance_km: distanceKm, duration_min: durationMin }));
    } catch {
      setRouteError('Greška pri kalkulaciji rute. Pokušaj ponovo.');
    } finally {
      setCalcLoading(false);
    }
  };

  const pricePerSeat = (() => {
    const d = parseFloat(form.distance_km);
    const c = parseFloat(form.fuel_consumption);
    const f = parseFloat(form.fuel_price_per_liter);
    const s = parseInt(form.seats, 10) || 4;
    if (!d || !c || !f) return null;
    return Math.round((d / 100) * c * f / s);
  })();

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.mestoOd.trim()) e.mestoOd = t('field_required');
      if (!form.mestoDo.trim()) e.mestoDo = t('field_required');
    }
    if (step === 1) {
      if (!form.datumVreme)       e.datumVreme    = t('field_required');
      if (!form.marka.trim())     e.marka         = t('field_required');
      if (!form.broj_tablica.trim()) e.broj_tablica = t('field_required');
    }
    if (step === 2) {
      if (!form.fuel_price_per_liter) e.fuel_price_per_liter = t('field_required');
    }
    return e;
  };

  const handleNext = () => {
    const errs = validateStep();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep((p) => p + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await publishRide({
        mestoOd:             form.mestoOd,
        mestoDo:             form.mestoDo,
        departure_lat:       form.departure_lat,
        departure_lng:       form.departure_lng,
        arrival_lat:         form.arrival_lat,
        arrival_lng:         form.arrival_lng,
        distance_km:         form.distance_km,
        fuel_price_per_liter: parseFloat(form.fuel_price_per_liter) || null,
        datumVreme:          form.datumVreme,
        seats:               parseInt(form.seats, 10),
        smoking:             form.smoking,
        music:               form.music,
        airCondition:        form.airCondition,
        vozilo: {
          marka:            form.marka,
          broj_tablica:     form.broj_tablica,
          boja:             form.boja,
          fuel_consumption: parseFloat(form.fuel_consumption) || null,
        },
      });
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const OPTIONS = [
    { key: 'smoking',      Icon: Cigarette, labelKey: 'smoking' },
    { key: 'music',        Icon: Music,     labelKey: 'music' },
    { key: 'airCondition', Icon: Wind,      labelKey: 'air_condition' },
  ];

  return (
    <div className="publish-ride page-enter">
      <div className="container">
        <h1 className="publish-ride__title">{t('publish_ride')}</h1>

        <div className="publish-ride__content">
          {/* Step indikator */}
          <div className="publish-ride__steps" role="list">
            {STEPS.map((key, i) => (
              <div key={key} role="listitem"
                className={`publish-ride__step ${i === step ? 'publish-ride__step--active' : ''} ${i < step ? 'publish-ride__step--done' : ''}`}
              >
                <div className="publish-ride__step-num">
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className="publish-ride__step-label">{t(key)}</span>
              </div>
            ))}
          </div>

          <div className="publish-ride__card">

            {/* ── Korak 1: Ruta ── */}
            {step === 0 && (
              <div className="publish-ride__fields">
                <AddressAutocomplete
                  label={t('from')} placeholder={t('from_placeholder')}
                  value={form.mestoOd}
                  onChange={(v) => set('mestoOd', v)}
                  onSelect={handleLocSelect('dep')}
                  onMapClick={() => { setMapTarget('dep'); setMapOpen(true); }}
                  icon={<MapPin size={16} />}
                  error={errors.mestoOd} required
                />
                <AddressAutocomplete
                  label={t('to')} placeholder={t('to_placeholder')}
                  value={form.mestoDo}
                  onChange={(v) => set('mestoDo', v)}
                  onSelect={handleLocSelect('arr')}
                  onMapClick={() => { setMapTarget('arr'); setMapOpen(true); }}
                  icon={<Flag size={16} />}
                  error={errors.mestoDo} required
                />

                {/* OSRM kalkulacija */}
                <div className="publish-ride__route-calc">
                  <Button
                    type="button" variant="secondary" size="sm"
                    onClick={calcRoute} loading={calcLoading}
                    icon={<Route size={14} />}
                  >
                    Izračunaj rutu
                  </Button>

                  {routeError && (
                    <div className="publish-ride__route-error">
                      <AlertCircle size={14} /> {routeError}
                    </div>
                  )}

                  {form.distance_km && (
                    <div className="publish-ride__route-info">
                      <span><Route size={13} /> {form.distance_km.toFixed(1)} km</span>
                      <span>~{form.duration_min} min</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Korak 2: Vreme i vozilo ── */}
            {step === 1 && (
              <div className="publish-ride__fields">
                <Input
                  name="datumVreme" label={t('datetime')} type="datetime-local"
                  value={form.datumVreme} onChange={(e) => set('datumVreme', e.target.value)}
                  error={errors.datumVreme} icon={<Calendar size={16} />}
                  min={new Date().toISOString().slice(0, 16)} required
                />

                <div className="publish-ride__seats-row">
                  <label className="publish-ride__section-label">
                    <Users size={14} /> {t('seats')}
                  </label>
                  <div className="publish-ride__seats-btns">
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n} type="button"
                        className={`publish-ride__seat-btn ${form.seats === n ? 'publish-ride__seat-btn--active' : ''}`}
                        onClick={() => set('seats', n)}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="publish-ride__section-label">
                  <Car size={16} /> {t('my_vehicle')}
                </p>
                <Input
                  name="marka" label={t('vehicle_brand')} placeholder={t('vehicle_brand_placeholder')}
                  value={form.marka} onChange={(e) => set('marka', e.target.value)}
                  error={errors.marka} icon={<Car size={16} />} required
                />
                <div className="publish-ride__row">
                  <Input
                    name="broj_tablica" label={t('license_plate')} placeholder={t('license_plate_placeholder')}
                    value={form.broj_tablica} onChange={(e) => set('broj_tablica', e.target.value)}
                    error={errors.broj_tablica} icon={<Hash size={16} />} required
                  />
                  <Input
                    name="boja" label={t('vehicle_color')} placeholder={t('vehicle_color_placeholder')}
                    value={form.boja} onChange={(e) => set('boja', e.target.value)}
                    icon={<Palette size={16} />}
                  />
                </div>
                <Input
                  name="fuel_consumption" label="Potrošnja goriva (L/100km)"
                  placeholder="npr. 6.5" type="number" step="0.1" min="1" max="50"
                  value={form.fuel_consumption} onChange={(e) => set('fuel_consumption', e.target.value)}
                  icon={<Fuel size={16} />}
                />
              </div>
            )}

            {/* ── Korak 3: Uslovi i cena ── */}
            {step === 2 && (
              <div className="publish-ride__fields">
                <Input
                  name="fuel_price_per_liter" label="Cena goriva (din/L)"
                  placeholder="npr. 185" type="number" step="1" min="50" max="500"
                  value={form.fuel_price_per_liter}
                  onChange={(e) => set('fuel_price_per_liter', e.target.value)}
                  error={errors.fuel_price_per_liter}
                  icon={<Fuel size={16} />} required
                />

                {pricePerSeat !== null && (
                  <div className="publish-ride__price-display">
                    <Coins size={20} />
                    <div>
                      <span className="publish-ride__price-amount">{pricePerSeat} din</span>
                      <span className="publish-ride__price-label">po osobi</span>
                    </div>
                  </div>
                )}

                <p className="publish-ride__section-label">{t('ride_options')}</p>
                <div className="publish-ride__options">
                  {OPTIONS.map(({ key, Icon, labelKey }) => (
                    <button
                      key={key} type="button"
                      className={`publish-ride__option-btn ${form[key] ? 'publish-ride__option-btn--active' : ''}`}
                      onClick={() => handleToggle(key)}
                    >
                      <Icon size={18} strokeWidth={1.75} />
                      <span>{t(labelKey)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Korak 4: Pregled ── */}
            {step === 3 && (
              <div className="publish-ride__summary">
                <h2 className="publish-ride__summary-title">{t('ride_details')}</h2>
                <div className="publish-ride__summary-grid">
                  {[
                    { label: t('from'),          value: form.mestoOd },
                    { label: t('to'),            value: form.mestoDo },
                    { label: t('datetime'),      value: form.datumVreme?.replace('T', ' ') },
                    { label: t('seats'),         value: form.seats },
                    { label: 'Distanca',         value: form.distance_km ? `${form.distance_km.toFixed(1)} km` : '—' },
                    { label: t('vehicle_brand'), value: form.marka },
                    { label: t('license_plate'), value: form.broj_tablica },
                    { label: 'Cena po osobi',     value: pricePerSeat ? `${pricePerSeat} din` : '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="publish-ride__summary-row">
                      <span className="publish-ride__summary-label">{label}</span>
                      <span className="publish-ride__summary-value">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="publish-ride__summary-options">
                  {OPTIONS.filter(({ key }) => form[key]).map(({ key, Icon, labelKey }) => (
                    <span key={key} className="publish-ride__summary-option">
                      <Icon size={13} /> {t(labelKey)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Navigacija */}
            <div className="publish-ride__actions">
              {step > 0 && (
                <Button variant="ghost" onClick={() => setStep((p) => p - 1)} icon={<ChevronLeft size={16} />}>
                  {t('back')}
                </Button>
              )}
              {step < STEPS.length - 1 ? (
                <Button variant="primary" onClick={handleNext} icon={<ChevronRight size={16} />}>
                  {t('next')}
                </Button>
              ) : (
                <Button variant="primary" loading={loading} onClick={handleSubmit} icon={<Check size={16} />}>
                  {t('submit')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map Picker modal */}
      <MapPicker
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        onSelect={handleMapSelect}
        title={mapTarget === 'dep' ? 'Odaberi polazak' : 'Odaberi dolazak'}
      />
    </div>
  );
}
