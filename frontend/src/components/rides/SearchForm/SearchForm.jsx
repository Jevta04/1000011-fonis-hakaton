import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Flag, Calendar, Users, Search as SearchIcon, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import { Input }  from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';
import './SearchForm.css';

export function SearchForm({ onSearch, compact = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({ mestoOd: '', mestoDo: '', date: '', seats: '1' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(form);
    else navigate(`/search?${new URLSearchParams(form).toString()}`);
  };

  return (
    <form className={`search-form ${compact ? 'search-form--compact' : ''}`} onSubmit={handleSubmit}>
      <div className="search-form__fields">
        <Input
          name="mestoOd"
          label={!compact ? t('from') : undefined}
          placeholder={t('from_placeholder')}
          value={form.mestoOd}
          onChange={handleChange}
          icon={<MapPin size={16} />}
          required
        />

        <div className="search-form__arrow" aria-hidden="true">
          <ArrowRight size={18} strokeWidth={2} />
        </div>

        <Input
          name="mestoDo"
          label={!compact ? t('to') : undefined}
          placeholder={t('to_placeholder')}
          value={form.mestoDo}
          onChange={handleChange}
          icon={<Flag size={16} />}
          required
        />

        <Input
          name="date"
          type="date"
          label={!compact ? t('date') : undefined}
          value={form.date}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          icon={<Calendar size={16} />}
          required
        />

        <div className="search-form__select-group">
          {!compact && (
            <label htmlFor="seats-select" className="search-form__label">{t('seats')}</label>
          )}
          <div className="search-form__select-wrapper">
            <span className="search-form__select-icon"><Users size={16} /></span>
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

      <Button type="submit" variant="primary" size={compact ? 'md' : 'lg'} fullWidth icon={<SearchIcon size={16} />}>
        {t('search')}
      </Button>
    </form>
  );
}
