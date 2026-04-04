import { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, X } from 'lucide-react';
import './AddressAutocomplete.css';

const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
const HEADERS   = { 'User-Agent': 'CorporateRideshare/1.0' };

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/**
 * AddressAutocomplete
 * @prop {string}   value         – controlled value (display text)
 * @prop {Function} onChange      – (text) => void — called on typing
 * @prop {Function} onSelect      – ({ address, lat, lng }) => void
 * @prop {string}   label
 * @prop {string}   placeholder
 * @prop {ReactNode} icon
 * @prop {boolean}  required
 * @prop {string}   error
 * @prop {Function} onMapClick    – opens map picker modal, optional
 */
export function AddressAutocomplete({
  value = '', onChange, onSelect,
  label, placeholder, icon, required, error, onMapClick,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen]               = useState(false);
  const [loading, setLoading]         = useState(false);
  const containerRef                  = useRef(null);

  const fetchSuggestions = useCallback(
    debounce(async (q) => {
      if (q.trim().length < 3) { setSuggestions([]); return; }
      setLoading(true);
      try {
        const url = `${NOMINATIM}?q=${encodeURIComponent(q + ', Beograd, Srbija')}&format=json&limit=5&addressdetails=1`;
        const res = await fetch(url, { headers: HEADERS });
        const data = await res.json();
        setSuggestions(data);
        setOpen(data.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400),
    []
  );

  const handleInput = (e) => {
    onChange(e.target.value);
    fetchSuggestions(e.target.value);
  };

  const handlePick = (item) => {
    const address = item.display_name.split(',').slice(0, 3).join(',').trim();
    onSelect({ address, lat: parseFloat(item.lat), lng: parseFloat(item.lon) });
    setOpen(false);
    setSuggestions([]);
  };

  const handleClear = () => {
    onChange('');
    onSelect({ address: '', lat: null, lng: null });
    setSuggestions([]);
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="addr-auto" ref={containerRef}>
      {label && (
        <label className="addr-auto__label">
          {label} {required && <span className="addr-auto__req">*</span>}
        </label>
      )}
      <div className={`addr-auto__field ${error ? 'addr-auto__field--error' : ''}`}>
        {icon && <span className="addr-auto__icon">{icon}</span>}
        <input
          className="addr-auto__input"
          type="text"
          value={value}
          onChange={handleInput}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
        />
        {value && (
          <button type="button" className="addr-auto__clear" onClick={handleClear} tabIndex={-1}>
            <X size={14} />
          </button>
        )}
        {onMapClick && (
          <button type="button" className="addr-auto__map-btn" onClick={onMapClick} tabIndex={-1}>
            <MapPin size={13} />
            <span className="addr-auto__map-btn-text">Izaberi na mapi</span>
          </button>
        )}
      </div>

      {loading && <div className="addr-auto__loading">Pretraži...</div>}

      {open && suggestions.length > 0 && (
        <ul className="addr-auto__dropdown" role="listbox">
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              className="addr-auto__option"
              role="option"
              onMouseDown={() => handlePick(s)}
            >
              <MapPin size={13} className="addr-auto__option-icon" />
              <span>{s.display_name.split(',').slice(0, 4).join(', ')}</span>
            </li>
          ))}
        </ul>
      )}

      {error && <span className="addr-auto__error">{error}</span>}
    </div>
  );
}
