import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Flag, Calendar, Car, Hash,
  Palette, ChevronRight, ChevronLeft, Check,
  Cigarette, Music, Wind,
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { publishRide }    from '../../services/apiService';
import { Input }   from '../../components/common/Input/Input';
import { Button }  from '../../components/common/Button/Button';
import './PublishRide.css';

const STEPS = ['publish_step1', 'publish_step2', 'publish_step3'];

const INITIAL = {
  // Korak 1 – Ruta
  mestoOd: '', mestoDo: '', datumVreme: '',
  // Korak 2 – Vozilo
  broj_tablica: '', marka: '', boja: '',
  // Opcije vožnje
  smoking: false, music: false, airCondition: false,
};

export function PublishRide() {
  const { t }    = useTranslation();
  const navigate = useNavigate();

  const [step, setStep]       = useState(0);
  const [form, setForm]       = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleToggle = (name) => {
    setForm((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.mestoOd.trim())    e.mestoOd    = t('field_required');
      if (!form.mestoDo.trim())    e.mestoDo    = t('field_required');
      if (!form.datumVreme)        e.datumVreme = t('field_required');
    }
    if (step === 1) {
      if (!form.marka.trim())       e.marka       = t('field_required');
      if (!form.broj_tablica.trim()) e.broj_tablica = t('field_required');
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
        mestoOd:     form.mestoOd,
        mestoDo:     form.mestoDo,
        datumVreme:  form.datumVreme,
        seats:       4,
        smoking:     form.smoking,
        music:       form.music,
        airCondition: form.airCondition,
        vozilo: {
          broj_tablica: form.broj_tablica,
          marka:        form.marka,
          boja:         form.boja,
        },
      });
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Opcije kao toggle dugmad
  const OPTIONS = [
    { key: 'smoking',      Icon: Cigarette,  labelKey: 'smoking'       },
    { key: 'music',        Icon: Music,      labelKey: 'music'         },
    { key: 'airCondition', Icon: Wind,       labelKey: 'air_condition' },
  ];

  return (
    <div className="publish-ride page-enter">
      <div className="container">
        <h1 className="publish-ride__title">{t('publish_ride')}</h1>

        {/* Step indikator */}
        <div className="publish-ride__steps" role="list">
          {STEPS.map((key, i) => (
            <div key={key} role="listitem"
              className={`publish-ride__step ${i === step ? 'publish-ride__step--active' : ''} ${i < step ? 'publish-ride__step--done' : ''}`}
            >
              <span className="publish-ride__step-num">
                {i < step ? <Check size={14} /> : i + 1}
              </span>
              <span className="publish-ride__step-label">{t(key)}</span>
            </div>
          ))}
        </div>

        <div className="publish-ride__card">

          {/* ── Korak 1: Ruta ── */}
          {step === 0 && (
            <div className="publish-ride__fields">
              <Input
                name="mestoOd" label={t('from')} placeholder={t('from_placeholder')}
                value={form.mestoOd} onChange={handleChange} error={errors.mestoOd}
                icon={<MapPin size={16} />} required
              />
              <Input
                name="mestoDo" label={t('to')} placeholder={t('to_placeholder')}
                value={form.mestoDo} onChange={handleChange} error={errors.mestoDo}
                icon={<Flag size={16} />} required
              />
              <Input
                name="datumVreme" label={t('datetime')} type="datetime-local"
                value={form.datumVreme} onChange={handleChange} error={errors.datumVreme}
                icon={<Calendar size={16} />}
                min={new Date().toISOString().slice(0, 16)} required
              />
            </div>
          )}

          {/* ── Korak 2: Vozilo i opcije ── */}
          {step === 1 && (
            <div className="publish-ride__fields">
              <p className="publish-ride__section-label">
                <Car size={16} /> {t('my_vehicle')}
              </p>
              <Input
                name="marka" label={t('vehicle_brand')} placeholder={t('vehicle_brand_placeholder')}
                value={form.marka} onChange={handleChange} error={errors.marka}
                icon={<Car size={16} />} required
              />
              <div className="publish-ride__row">
                <Input
                  name="broj_tablica" label={t('license_plate')} placeholder={t('license_plate_placeholder')}
                  value={form.broj_tablica} onChange={handleChange} error={errors.broj_tablica}
                  icon={<Hash size={16} />} required
                />
                <Input
                  name="boja" label={t('vehicle_color')} placeholder={t('vehicle_color_placeholder')}
                  value={form.boja} onChange={handleChange}
                  icon={<Palette size={16} />}
                />
              </div>

              {/* Opcije vožnje */}
              <p className="publish-ride__section-label">
                {t('ride_options')}
              </p>
              <div className="publish-ride__options">
                {OPTIONS.map(({ key, Icon, labelKey }) => (
                  <button
                    key={key}
                    type="button"
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

          {/* ── Korak 3: Pregled ── */}
          {step === 2 && (
            <div className="publish-ride__summary">
              <h2 className="publish-ride__summary-title">{t('ride_details')}</h2>
              <div className="publish-ride__summary-grid">
                {[
                  { label: t('from'),          value: form.mestoOd },
                  { label: t('to'),            value: form.mestoDo },
                  { label: t('datetime'),      value: form.datumVreme?.replace('T', ' ') },
                  { label: t('vehicle_brand'), value: form.marka },
                  { label: t('license_plate'), value: form.broj_tablica },
                  { label: t('vehicle_color'), value: form.boja || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="publish-ride__summary-row">
                    <span className="publish-ride__summary-label">{label}</span>
                    <span className="publish-ride__summary-value">{value}</span>
                  </div>
                ))}
              </div>

              {/* Aktivne opcije */}
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
  );
}
