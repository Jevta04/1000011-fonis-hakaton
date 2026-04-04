import { useTranslation } from '../../../hooks/useTranslation';
import { formatDate, formatPrice, formatDuration } from '../../../utils/helpers';
import './RideCard.css';

/**
 * RideCard – kartica vožnje (BlaBlaCar stil).
 *
 * @param {string}  from        – grad polaska
 * @param {string}  to          – grad odredišta
 * @param {string}  date        – ISO datum (npr. "2026-04-10")
 * @param {string}  time        – vreme polaska (npr. "07:30")
 * @param {number}  seats       – broj slobodnih mesta
 * @param {number}  price       – cena po mestu (RSD)
 * @param {string}  driver      – ime vozača
 * @param {string}  avatar      – inicijal ili URL slike
 * @param {string}  duration    – trajanje vožnje (npr. "2h 30min")
 * @param {string}  vehicle     – model vozila
 * @param {Function} onJoin     – callback za prijavu
 * @param {boolean} compact     – kompaktniji prikaz
 */
export function RideCard({
  from,
  to,
  date,
  time,
  seats = 0,
  price,
  driver,
  avatar,
  duration,
  vehicle,
  onJoin,
  compact = false,
  className = '',
}) {
  const { t } = useTranslation();
  const isFull = seats === 0;

  return (
    <article
      className={`ride-card ${isFull ? 'ride-card--full' : ''} ${compact ? 'ride-card--compact' : ''} ${className}`}
      aria-label={`Vožnja od ${from} do ${to}`}
    >
      {/* Ruta – BlaBlaCar stil sa tačkama */}
      <div className="ride-card__route">
        <div className="ride-card__route-stops">
          {/* Polazište */}
          <div className="ride-card__stop">
            <span className="ride-card__dot ride-card__dot--start" />
            <div className="ride-card__stop-info">
              <span className="ride-card__city">{from}</span>
              <span className="ride-card__time">{time}</span>
            </div>
          </div>

          {/* Linija između tačaka */}
          <div className="ride-card__line-wrapper" aria-hidden="true">
            <div className="ride-card__line" />
            {duration && (
              <span className="ride-card__duration">{duration}</span>
            )}
          </div>

          {/* Odredište */}
          <div className="ride-card__stop">
            <span className="ride-card__dot ride-card__dot--end" />
            <div className="ride-card__stop-info">
              <span className="ride-card__city">{to}</span>
              <span className="ride-card__time ride-card__time--muted">
                {formatDate(date)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Razdvajač */}
      <div className="ride-card__divider" aria-hidden="true" />

      {/* Footer: vozač + cena + mesta + dugme */}
      <div className="ride-card__footer">
        {/* Vozač */}
        <div className="ride-card__driver">
          <div className="ride-card__avatar" aria-hidden="true">
            {avatar && avatar.startsWith('http') ? (
              <img src={avatar} alt={driver} className="ride-card__avatar-img" />
            ) : (
              <span>{avatar || driver?.charAt(0)?.toUpperCase() || '?'}</span>
            )}
          </div>
          <div className="ride-card__driver-info">
            <span className="ride-card__driver-name">{driver}</span>
            {vehicle && (
              <span className="ride-card__vehicle">{vehicle}</span>
            )}
          </div>
        </div>

        {/* Desna strana: mesta + cena + dugme */}
        <div className="ride-card__meta">
          {/* Slobodna mesta */}
          <div className="ride-card__seats" aria-label={`${seats} ${t('seats_available')}`}>
            {Array.from({ length: Math.min(seats, 4) }, (_, i) => (
              <span key={i} className="ride-card__seat-icon" aria-hidden="true">👤</span>
            ))}
            <span className="ride-card__seats-count">
              {seats} {seats === 1 ? t('seat_one') : t('seats_available')}
            </span>
          </div>

          {/* Cena */}
          <div className="ride-card__price">
            <span className="ride-card__price-amount">
              {formatPrice(price)}
            </span>
            <span className="ride-card__price-label">{t('price_per_seat')}</span>
          </div>

          {/* Dugme za prijavu */}
          {onJoin && (
            <button
              className={`ride-card__join-btn ${isFull ? 'ride-card__join-btn--disabled' : ''}`}
              onClick={!isFull ? onJoin : undefined}
              disabled={isFull}
              aria-disabled={isFull}
            >
              {isFull ? t('ride_full') : t('join_ride')}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
