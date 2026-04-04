import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import { Input }  from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';
import './SearchForm.css';

export function SearchForm({ onSearch, compact = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    from:  '',
    to:    '',
    date:  '',
    seats: '1',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(form).toString();

    if (onSearch) {
      onSearch(form);
    } else {
      navigate(`/search?${params}`);
    }
  };

  return (
    <form
      className={`search-form ${compact ? 'search-form--compact' : ''}`}
      onSubmit={handleSubmit}
      aria-label={t('find_ride')}
    >
      <div className="search-form__fields">
        {/* Polazište */}
        <Input
          name="from"
          label={!compact ? t('from') : undefined}
          placeholder={t('from_placeholder')}
          value={form.from}
          onChange={handleChange}
          icon="📍"
          required
        />

        {/* Strelica smera (dekorativna) */}
        <div className="search-form__arrow" aria-hidden="true">→</div>

        {/* Odredište */}
        <Input
          name="to"
          label={!compact ? t('to') : undefined}
          placeholder={t('to_placeholder')}
          value={form.to}
          onChange={handleChange}
          icon="🏁"
          required
        />

        {/* Datum */}
        <Input
          name="date"
          type="date"
          label={!compact ? t('date') : undefined}
          value={form.date}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          icon="📅"
          required
        />

        {/* Broj mesta */}
        <div className="search-form__select-group">
          {!compact && (
            <label htmlFor="seats-select" className="search-form__label">
              {t('seats')}
            </label>
          )}
          <div className="search-form__select-wrapper">
            <span className="search-form__select-icon" aria-hidden="true">👥</span>
            <select
              id="seats-select"
              name="seats"
              className="search-form__select"
              value={form.seats}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? t('seat_one') : t('seats')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Button type="submit" variant="primary" size={compact ? 'md' : 'lg'} fullWidth>
        🔍 {t('search')}
      </Button>
    </form>
  );
}
