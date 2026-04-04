import { MapPin, Flag, Users, Car, ChevronRight, CigaretteOff, Cigarette, Music, Wind, PawPrint, X, LogOut } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import { formatDate } from '../../../utils/helpers';
import './RideCard.css';

const COLOR_MAP = {
  'crna': '#1a1a1a',   'black': '#1a1a1a',
  'bela': '#e8e8e8',   'white': '#e8e8e8',
  'siva': '#718096',   'grey': '#718096', 'gray': '#718096',
  'crvena': '#e53e3e', 'red': '#e53e3e',
  'plava': '#3182ce',  'blue': '#3182ce',
  'zelena': '#38a169', 'green': '#38a169',
  'zuta': '#d69e2e',   'žuta': '#d69e2e', 'yellow': '#d69e2e',
  'narandzasta': '#dd6b20', 'narandžasta': '#dd6b20', 'orange': '#dd6b20',
  'ljubicasta': '#805ad5',  'ljubičasta': '#805ad5',  'purple': '#805ad5',
  'braon': '#92400e',  'brown': '#92400e',
  'srebrna': '#b0b8c4','silver': '#b0b8c4',
  'zlatna': '#d4a017', 'gold': '#d4a017',
  'tamnoplava': '#2a4365', 'navy': '#2a4365',
  'bordo': '#702459',  'burgundy': '#702459',
  'tirkizna': '#0694a2','turquoise': '#0694a2',
  'bordova': '#702459',
};

function getCarColor(boja) {
  if (!boja) return null;
  return COLOR_MAP[boja.toLowerCase().trim()] ?? '#a0aec0';
}

export function RideCard({
  mestoOd, mestoDo, datumVreme,
  seats = 0, driver, driverId, avatar, vehicle, boja,
  smoking = false, music = false, airCondition = false, pets = false,
  isJoined = false,
  onJoin, onLeave, onDelete,
  compact = false, className = '',
}) {
  const { t } = useTranslation();
  const isFull = seats === 0;

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); }
    catch { return {}; }
  })();
  const isOwnRide = driverId && currentUser?.id && driverId === currentUser.id;

  const date = datumVreme ? new Date(datumVreme) : null;
  const timeStr = date
    ? date.toLocaleTimeString('sr-Latn-RS', { hour: '2-digit', minute: '2-digit' })
    : '';
  const dateStr = date ? formatDate(datumVreme) : '';

  const carColor = getCarColor(boja);

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
      {/* Ruta – timeline layout */}
      <div className="ride-card__route">
        <div className="ride-card__timeline">
          <span className="ride-card__dot ride-card__dot--start">
            <MapPin size={11} strokeWidth={2.5} />
          </span>
          <div className="ride-card__line" />
          <span className="ride-card__dot ride-card__dot--end">
            <Flag size={10} strokeWidth={2.5} />
          </span>
        </div>

        <div className="ride-card__route-texts">
          <div className="ride-card__stop-info">
            <span className="ride-card__city">{mestoOd}</span>
            <span className="ride-card__time">{timeStr}</span>
          </div>
          <div className="ride-card__stop-info">
            <span className="ride-card__city">{mestoDo}</span>
            <span className="ride-card__time ride-card__time--muted">{dateStr}</span>
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
                <Car size={11} strokeWidth={2} />
                {carColor && (
                  <span
                    className="ride-card__car-color"
                    style={{ backgroundColor: carColor }}
                    title={boja}
                    aria-label={boja}
                  />
                )}
                {vehicle}{boja ? ` · ${boja}` : ''}
              </span>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="ride-card__meta">
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

          <div className="ride-card__seats">
            <Users size={14} strokeWidth={2} />
            <span className="ride-card__seats-count">
              {seats} {seats === 1 ? t('seat_one') : t('seats_available')}
            </span>
          </div>

          {isOwnRide ? (
            <button className="ride-card__cancel-btn" onClick={onDelete}>
              <X size={14} /> {t('cancel_ride')}
            </button>
          ) : isJoined ? (
            <button className="ride-card__leave-btn" onClick={onLeave}>
              <LogOut size={14} /> {t('leave_ride')}
            </button>
          ) : onJoin && (
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
