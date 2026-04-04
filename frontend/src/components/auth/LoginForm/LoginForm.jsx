import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import { login }   from '../../../services/apiService';
import { Input }   from '../../common/Input/Input';
import { Button }  from '../../common/Button/Button';
import './LoginForm.css';

// Validacija kompanijskog emaila (mora imati domenu, ne gmail/yahoo/hotmail)
const PERSONAL_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com'];

function isCompanyEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  return !PERSONAL_DOMAINS.includes(domain);
}

export function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Ukloni grešku kad korisnik počne da kuca
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = t('email_invalid');
    } else if (!isCompanyEmail(form.email)) {
      newErrors.email = t('email_invalid');
    }

    if (!form.password || form.password.length < 6) {
      newErrors.password = t('password_required');
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await login(form.email, form.password);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      if (err.response?.status === 422 || err.response?.status === 401) {
        setServerError(t('login_error'));
      } else {
        setServerError(t('error_network'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-wrapper">
      {/* Header */}
      <div className="login-form__header">
        <div className="login-form__logo" aria-hidden="true">🚗</div>
        <h1 className="login-form__title">{t('login_title')}</h1>
        <p className="login-form__subtitle">{t('login_subtitle')}</p>
      </div>

      {/* Server greška */}
      {serverError && (
        <div className="login-form__server-error" role="alert">
          ⚠️ {serverError}
        </div>
      )}

      {/* Forma */}
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <Input
          name="email"
          type="email"
          label={t('email')}
          placeholder={t('email_placeholder')}
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          icon="✉️"
          required
          autoComplete="email"
          autoFocus
        />

        <Input
          name="password"
          type="password"
          label={t('password')}
          placeholder={t('password_placeholder')}
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          icon="🔒"
          required
          autoComplete="current-password"
        />

        <div className="login-form__forgot">
          <a href="#" className="login-form__forgot-link">
            {t('forgot_password')}
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
        >
          {t('login')}
        </Button>
      </form>
    </div>
  );
}
