import { useState } from 'react';
import { useNavigate }    from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { publishRide }    from '../../services/apiService';
import { Input }   from '../../components/common/Input/Input';
import { Button }  from '../../components/common/Button/Button';
import './PublishRide.css';

const STEPS = ['publish_step1', 'publish_step2', 'publish_step3'];

const INITIAL_FORM = {
  from: '', to: '', date: '', time: '',
  seats: '1', price: '', vehicle_model: '',
  license_plate: '', notes: '',
};

export function PublishRide() {
  const { t }  = useTranslation();
  const navigate = useNavigate();

  const [step, setStep]     = useState(0);
  const [form, setForm]     = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 0) {
      if (!form.from) newErrors.from = t('from') + ' ' + t('password_required').toLowerCase();
      if (!form.to)   newErrors.to   = t('to')   + ' ' + t('password_required').toLowerCase();
      if (!form.date) newErrors.date = t('date')  + ' ' + t('password_required').toLowerCase();
      if (!form.time) newErrors.time = t('time')  + ' ' + t('password_required').toLowerCase();
    }
    if (step === 1) {
      if (!form.price) newErrors.price = t('price') + ' ' + t('password_required').toLowerCase();
      if (!form.vehicle_model) newErrors.vehicle_model = t('vehicle_model') + ' ' + t('password_required').toLowerCase();
    }
    return newErrors;
  };

  const handleNext = () => {
    const errs = validateStep();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await publishRide(form);
      navigate('/', { state: { success: true } });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="publish-ride page-enter">
      <div className="container">
        <h1 className="publish-ride__title">{t('publish_ride')}</h1>

        {/* Step indikator */}
        <div className="publish-ride__steps" role="list">
          {STEPS.map((key, i) => (
            <div
              key={key}
              role="listitem"
              className={`publish-ride__step ${i === step ? 'publish-ride__step--active' : ''} ${i < step ? 'publish-ride__step--done' : ''}`}
              aria-current={i === step ? 'step' : undefined}
            >
              <span className="publish-ride__step-num">
                {i < step ? '✓' : i + 1}
              </span>
              <span className="publish-ride__step-label">{t(key)}</span>
            </div>
          ))}
        </div>

        {/* Sadržaj koraka */}
        <div className="publish-ride__card">
          {/* Korak 1: Ruta */}
          {step === 0 && (
            <div className="publish-ride__fields">
              <Input name="from"  label={t('from')} placeholder={t('from_placeholder')} value={form.from}  onChange={handleChange} error={errors.from}  icon="📍" required />
              <Input name="to"    label={t('to')}   placeholder={t('to_placeholder')}   value={form.to}    onChange={handleChange} error={errors.to}    icon="🏁" required />
              <Input name="date"  label={t('date')}  type="date" value={form.date} onChange={handleChange} error={errors.date}  icon="📅" min={new Date().toISOString().split('T')[0]} required />
              <Input name="time"  label={t('time')}  type="time" value={form.time} onChange={handleChange} error={errors.time}  icon="🕐" required />
            </div>
          )}

          {/* Korak 2: Detalji */}
          {step === 1 && (
            <div className="publish-ride__fields">
              <div className="publish-ride__row">
                <Input name="seats" label={t('seats')} type="number" min="1" max="8" value={form.seats} onChange={handleChange} icon="👥" />
                <Input name="price" label={`${t('price')} (RSD)`} type="number" min="0" placeholder="500" value={form.price} onChange={handleChange} error={errors.price} icon="💰" required />
              </div>
              <Input name="vehicle_model"  label={t('vehicle_model')}  placeholder="npr. Škoda Octavia 2022" value={form.vehicle_model}  onChange={handleChange} error={errors.vehicle_model} icon="🚗" required />
              <Input name="license_plate"  label={t('license_plate')}  placeholder="BG 123-AB"               value={form.license_plate}  onChange={handleChange} icon="🔢" />
              <div className="publish-ride__textarea-group">
                <label htmlFor="notes-field" className="publish-ride__label">
                  Napomene (opcionalno)
                </label>
                <textarea id="notes-field" name="notes" className="publish-ride__textarea" placeholder="Npr. ne pušim u kolima, pratim rutu E75..." value={form.notes} onChange={handleChange} rows={3} />
              </div>
            </div>
          )}

          {/* Korak 3: Pregled */}
          {step === 2 && (
            <div className="publish-ride__summary">
              <h2 className="publish-ride__summary-title">{t('ride_details')}</h2>
              <div className="publish-ride__summary-grid">
                {[
                  { label: t('from'),          value: form.from },
                  { label: t('to'),            value: form.to },
                  { label: t('date'),          value: form.date },
                  { label: t('time'),          value: form.time },
                  { label: t('seats'),         value: form.seats },
                  { label: t('price'),         value: `${form.price} RSD` },
                  { label: t('vehicle_model'), value: form.vehicle_model },
                  { label: t('license_plate'), value: form.license_plate || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="publish-ride__summary-row">
                    <span className="publish-ride__summary-label">{label}</span>
                    <span className="publish-ride__summary-value">{value}</span>
                  </div>
                ))}
              </div>
              {form.notes && (
                <p className="publish-ride__notes">{form.notes}</p>
              )}
            </div>
          )}

          {/* Navigacija */}
          <div className="publish-ride__actions">
            {step > 0 && (
              <Button variant="ghost" onClick={handleBack}>
                ← {t('back')}
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button variant="primary" onClick={handleNext}>
                {t('next')} →
              </Button>
            ) : (
              <Button variant="primary" loading={loading} onClick={handleSubmit}>
                ✓ {t('submit')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
