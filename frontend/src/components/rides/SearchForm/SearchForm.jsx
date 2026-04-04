import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Flag, Calendar, Search as SearchIcon, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import { Input }  from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';
import './SearchForm.css';

export function SearchForm({ onSearch, compact = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({ mestoOd: '', mestoDo: '', date: '' });

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
      </div>

      <Button type="submit" variant="primary" size={compact ? 'md' : 'lg'} fullWidth icon={<SearchIcon size={16} />}>
        {t('search')}
      </Button>
    </form>
  );
}
