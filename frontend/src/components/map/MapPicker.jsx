import { useEffect, useRef, useState } from 'react';
import { X, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './MapPicker.css';

// Fix Leaflet default icon path (Vite/webpack asset issue)
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const BEOGRAD = [44.8176, 20.4569];
const NOMINATIM_REVERSE = 'https://nominatim.openstreetmap.org/reverse';
const HEADERS = { 'User-Agent': 'CorporateRideshare/1.0' };

/**
 * MapPicker modal — klik na mapu → reverse geocoding → onSelect({ lat, lng, address })
 * @prop {boolean}  open
 * @prop {Function} onClose
 * @prop {Function} onSelect ({ lat, lng, address })
 * @prop {string}   title
 */
export function MapPicker({ open, onClose, onSelect, title = 'Odaberi lokaciju' }) {
  const mapContainerRef = useRef(null);
  const mapRef          = useRef(null);
  const markerRef       = useRef(null);
  const [address, setAddress]   = useState('');
  const [coords, setCoords]     = useState(null);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!open) return;

    // Initialize map on next tick (wait for DOM)
    const timer = setTimeout(() => {
      if (!mapContainerRef.current || mapRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: BEOGRAD,
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(map);
        }

        setCoords({ lat, lng });
        setLoading(true);
        setAddress('');

        try {
          const url = `${NOMINATIM_REVERSE}?lat=${lat}&lon=${lng}&format=json`;
          const res = await fetch(url, { headers: HEADERS });
          const data = await res.json();
          const display = data.display_name?.split(',').slice(0, 3).join(',').trim() || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          setAddress(display);
        } catch {
          setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } finally {
          setLoading(false);
        }
      });

      mapRef.current = map;
    }, 100);

    return () => clearTimeout(timer);
  }, [open]);

  // Cleanup on close
  useEffect(() => {
    if (!open && mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      markerRef.current = null;
      setAddress('');
      setCoords(null);
    }
  }, [open]);

  const handleConfirm = () => {
    if (!coords) return;
    onSelect({ lat: coords.lat, lng: coords.lng, address });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="map-picker-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="map-picker-modal">
        <div className="map-picker-header">
          <MapPin size={18} />
          <span>{title}</span>
          <button className="map-picker-close" onClick={onClose}><X size={18} /></button>
        </div>

        <p className="map-picker-hint">Klikni na mapu da odabereš lokaciju</p>

        <div className="map-picker-map" ref={mapContainerRef} />

        {coords && (
          <div className="map-picker-result">
            <div className="map-picker-address">
              {loading ? 'Učitavanje adrese...' : (address || 'Nepoznata adresa')}
            </div>
            <button
              className="map-picker-confirm"
              onClick={handleConfirm}
              disabled={loading}
            >
              Potvrdi lokaciju
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
