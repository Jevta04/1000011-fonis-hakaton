import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag, Calendar, Search as SearchIcon, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import { AddressAutocomplete } from '../../map/AddressAutocomplete';
import { MapPicker }           from '../../map/MapPicker';
import { Button } from '../../common/Button/Button';
import { Input }  from '../../common/Input/Input';
import './SearchForm.css';

export function SearchForm({ onSearch, compact = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [from, setFrom]     = useState({ address: '', lat: null, lng: null });
  const [to, setTo]         = useState({ address: '', lat: null, lng: null });
  const [date, setDate]     = useState('');
  const [mapFor, setMapFor] = useState(null); // 'from' | 'to' | null

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (from.address) params.mestoOd = from.address;
    if (to.address)   params.mestoDo = to.address;
    if (date)         params.date    = date;
    if (from.lat)     { params.departure_lat = from.lat; params.departure_lng = from.lng; }
    if (to.lat)       { params.arrival_lat   = to.lat;   params.arrival_lng   = to.lng; }

    if (onSearch) onSearch(params);
    else navigate(`/search?${new URLSearchParams(params).toString()}`);
  };

  const handleMapSelect = (field) => ({ lat, lng, address }) => {
    if (field === 'from') setFrom({ address, lat, lng });
    else                  setTo({ address, lat, lng });
    setMapFor(null);
  };

  return (
    <>
      <form className={`search-form ${compact ? 'search-form--compact' : ''}`} onSubmit={handleSubmit}>
        <div className="search-form__fields">
          <AddressAutocomplete
            label={!compact ? t('from') : undefined}
            placeholder={t('from_placeholder')}
            value={from.address}
            onChange={(text) => setFrom((p) => ({ ...p, address: text, lat: null, lng: null }))}
            onSelect={({ address, lat, lng }) => setFrom({ address, lat, lng })}
            onMapClick={() => setMapFor('from')}
            required
          />

          <div className="search-form__arrow" aria-hidden="true">
            <ArrowRight size={18} strokeWidth={2} />
          </div>

          <AddressAutocomplete
            label={!compact ? t('to') : undefined}
            placeholder={t('to_placeholder')}
            value={to.address}
            onChange={(text) => setTo((p) => ({ ...p, address: text, lat: null, lng: null }))}
            onSelect={({ address, lat, lng }) => setTo({ address, lat, lng })}
            icon={<Flag size={16} />}
            onMapClick={() => setMapFor('to')}
            required
          />

          <Input
            name="date"
            type="date"
            label={!compact ? t('date') : undefined}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            icon={<Calendar size={16} />}
            required
          />
        </div>

        <Button type="submit" variant="primary" size={compact ? 'md' : 'lg'} fullWidth icon={<SearchIcon size={16} />}>
          {t('search')}
        </Button>
      </form>

      <MapPicker
        open={mapFor === 'from'}
        onClose={() => setMapFor(null)}
        onSelect={handleMapSelect('from')}
        title={t('from_placeholder')}
      />
      <MapPicker
        open={mapFor === 'to'}
        onClose={() => setMapFor(null)}
        onSelect={handleMapSelect('to')}
        title={t('to_placeholder')}
      />
    </>
  );
}
