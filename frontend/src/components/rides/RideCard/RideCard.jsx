import { MapPin, Flag, Users, Car, ChevronRight, CigaretteOff, Cigarette, Music, Wind, PawPrint } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import { formatDate } from '../../../utils/helpers';
import './RideCard.css';

/**
 * RideCard – kartica vožnje (interna kompanijska aplikacija).
 * Nema cenu. Prikazuje opcije (smoking, muzika, klima, ljubimci).
 *
 * @param {string}  mestoOd
 * @param {string}  mestoDo
 * @param {string}  datumVreme   – ISO datetime
 * @param {number}  seats        – slobodna mesta
 * @param {string}  driver       – ime vozača
 * @param {string}  avatar       – inicijal ili URL
 * @param {string}  vehicle      – marka vozila
 * @param {boolean} smoking
 * @param {boolean} music
 * @param {boolean} airCondition
 * @param {boolean} pets
 * @param {Function} onJoin
 * @param {boolean} compact
 */
export function RideCard({
  mestoOd, mestoDo, datumVreme,
  seats = 0, driver, avatar, vehicle,
  smoking = false, music = false, airCondition = false, pets = false,
  onJoin, compact = false, className = '',
}) {
  const { t } = useTranslation();
  const isFull = seats === 0;

  const date = datumVreme ? new Date(datumVreme) : null;
  const timeStr = date
    ? date.toLocaleTimeString('sr-Latn-RS', { hour: '2-digit', minute: '2-digit' })
    : '';
  const dateStr = date ? formatDate(datumVreme) : '';

  const options = [
    smoking      ? { Icon: Cigarette,   label: t('smoking'),       active: true  } : { Icon: CigaretteOff, label: t('no_smoking'),  active: false },
    music        ? { Icon: Music,        label: t('music'),         active: true  } : null,
    airCondition ? { Icon: Wind,         label: t('air_condition'), active: true  } : null,
    pets         ? { Icon: PawPrint,     label: t('pets'),          active: true  } : null,
  ].filter(Boolean);

  return (
    <article
      className={`ride-card ${isFull ? 'ride-card--full' : ''} ${compact ? 'ride-card--compact' : ''} ${className}`}
      aria-label={`Vožnja od ${mestoOd} do ${mestoDo}`}
    >
      {/* Ruta */}
      <div className="ride-card__route">
        <div className="ride-card__route-stops">
          <div className="ride-card__stop">
            <span className="ride-card__dot ride-card__dot--start">
              <MapPin size={11} strokeWidth={2.5} />
            </span>
            <div className="ride-card__stop-info">
              <span className="ride-card__city">{mestoOd}</span>
              <span className="ride-card__time">{timeStr}</span>
            </div>
          </div>

          <div className="ride-card__line-wrapper" aria-hidden="true">
            <div className="ride-card__line" />
          </div>

          <div className="ride-card__stop">
            <span className="ride-card__dot ride-card__dot--end">
              <Flag size={10} strokeWidth={2.5} />
            </span>
            <div className="ride-card__stop-info">
              <span className="ride-card__city">{mestoDo}</span>
              <span className="ride-card__time ride-card__time--muted">{dateStr}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ride-card__divider" aria-hidden="true" />

      {/* Footer */}
      <div className="ride-card__footer">
        {/* Vozač */}
        <div className="ride-card__driver">
          <div className="ride-card__avatar" aria-hidden="true">
            {avatar && avatar.startsWith('http')
              ? <img src={avatar} alt={driver} className="ride-card__avatar-img" />
              : <span>{avatar || driver?.charAt(0)?.toUpperCase() || '?'}</span>
            }
          </div>
          <div className="ride-card__driver-info">
            <span className="ride-card__driver-name">{driver}</span>
            {vehicle && (
              <span className="ride-card__vehicle">
                <Car size={11} strokeWidth={2} /> {vehicle}
              </span>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="ride-card__meta">
          {/* Opcije */}
          {!compact && options.length > 0 && (
            <div className="ride-card__options">
              {options.map(({ Icon, label, active }) => (
                <span
                  key={label}
                  className={`ride-card__option ${active ? 'ride-card__option--active' : 'ride-card__option--inactive'}`}
                  title={label}
                >
                  <Icon size={13} strokeWidth={2} />
                </span>
              ))}
            </div>
          )}

          {/* Slobodna mesta */}
          <div className="ride-card__seats">
            <Users size={13} strokeWidth={2} />
            <span className="ride-card__seats-count">
              {seats} {seats === 1 ? t('seat_one') : t('seats_available')}
            </span>
          </div>

          {/* Dugme */}
          {onJoin && (
            <button
              className={`ride-card__join-btn ${isFull ? 'ride-card__join-btn--disabled' : ''}`}
              onClick={!isFull ? onJoin : undefined}
              disabled={isFull}
            >
              {isFull ? t('ride_full') : <>{t('join_ride')} <ChevronRight size={14} /></>}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
