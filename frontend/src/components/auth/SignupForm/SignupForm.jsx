import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Building2, AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import { register, getCompanies } from '../../../services/apiService';
import { Input }    from '../../common/Input/Input';
import { Button }   from '../../common/Button/Button';
import './SignupForm.css';

const PERSONAL_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com'];

function isCompanyEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  return !PERSONAL_DOMAINS.includes(email.split('@')[1]?.toLowerCase());
}

const INITIAL = {
  ime: '', prezime: '', email: '', password: '',
  password_confirmation: '', broj_telefona: '', kompanija_id: '',
};

export function SignupForm({ onSwitchToLogin }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm]               = useState(INITIAL);
  const [errors, setErrors]           = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading]         = useState(false);
  const [companies, setCompanies]     = useState([]);

  useEffect(() => {
    getCompanies()
      .then((res) => setCompanies(res.data?.data || res.data || []))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.ime.trim())     e.ime     = t('field_required');
    if (!form.prezime.trim()) e.prezime = t('field_required');
    if (!isCompanyEmail(form.email)) e.email = t('email_invalid');
    if (form.password.length < 6)   e.password = t('password_required');
    if (form.password !== form.password_confirmation) e.password_confirmation = t('password_mismatch');
    if (!form.broj_telefona.trim()) e.broj_telefona = t('field_required');
    if (!form.kompanija_id)         e.kompanija_id  = t('field_required');
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('ime',           form.ime);
      formData.append('prezime',       form.prezime);
      formData.append('email',         form.email);
      formData.append('password',              form.password);
      formData.append('password_confirmation', form.password_confirmation);
      formData.append('broj_telefona', form.broj_telefona);
      formData.append('kompanija_id',  form.kompanija_id);
      formData.append('uloga',         'zaposleni');

      const response = await register(formData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } catch (err) {
      if (err.response?.status === 422) {
        const apiErrors = err.response.data?.errors || {};
        setErrors(apiErrors);
      } else {
        setServerError(t('error_network'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-form-wrapper">
      <div className="signup-form__header">
        <div className="signup-form__logo-icon">
          <CheckCircle size={36} strokeWidth={1.5} />
        </div>
        <h1 className="signup-form__title">{t('register_title')}</h1>
        <p className="signup-form__subtitle">{t('register_subtitle')}</p>
      </div>

      {serverError && (
        <div className="signup-form__server-error" role="alert">
          <AlertCircle size={16} /> {serverError}
        </div>
      )}

      <form className="signup-form" onSubmit={handleSubmit} noValidate>
        <div className="signup-form__row">
          <Input
            name="ime"
            label={t('ime')}
            placeholder={t('ime_placeholder')}
            value={form.ime}
            onChange={handleChange}
            error={errors.ime}
            icon={<User size={16} />}
            required
          />
          <Input
            name="prezime"
            label={t('prezime')}
            placeholder={t('prezime_placeholder')}
            value={form.prezime}
            onChange={handleChange}
            error={errors.prezime}
            icon={<User size={16} />}
            required
          />
        </div>

        <Input
          name="email" type="email"
          label={t('email')} placeholder={t('email_placeholder')}
          value={form.email} onChange={handleChange}
          error={errors.email} icon={<Mail size={16} />}
          required autoComplete="email"
        />

        <Input
          name="broj_telefona" type="tel"
          label={t('phone')} placeholder={t('phone_placeholder')}
          value={form.broj_telefona} onChange={handleChange}
          error={errors.broj_telefona} icon={<Phone size={16} />}
          required
        />

        <div className="signup-form__field">
          <label className="signup-form__label">
            <Building2 size={16} className="signup-form__field-icon" />
            {t('company')} *
          </label>
          <select
            name="kompanija_id"
            value={form.kompanija_id}
            onChange={handleChange}
            className={`signup-form__select ${errors.kompanija_id ? 'signup-form__select--error' : ''}`}
            required
          >
            <option value="">{t('select_company')}</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name || c.naziv}</option>
            ))}
          </select>
          {errors.kompanija_id && (
            <span className="signup-form__error">{errors.kompanija_id}</span>
          )}
        </div>

        <Input
          name="password" type="password"
          label={t('password')} placeholder={t('password_placeholder')}
          value={form.password} onChange={handleChange}
          error={errors.password} icon={<Lock size={16} />}
          required autoComplete="new-password"
        />

        <Input
          name="password_confirmation" type="password"
          label={t('password_confirm')} placeholder={t('password_confirm_placeholder')}
          value={form.password_confirmation} onChange={handleChange}
          error={errors.password_confirmation} icon={<Lock size={16} />}
          required autoComplete="new-password"
        />

        <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
          {t('register')}
        </Button>
      </form>

      <p className="signup-form__switch">
        {t('already_have_account')}{' '}
        <button className="signup-form__switch-btn" onClick={onSwitchToLogin}>
          {t('login_tab')}
        </button>
      </p>
    </div>
  );
}