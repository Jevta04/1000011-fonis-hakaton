import './LocaleSwitch.css';

const FlagSR = () => (
  <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
    <clipPath id="flag-sr-clip">
      <circle cx="15" cy="15" r="15"/>
    </clipPath>
    <g clipPath="url(#flag-sr-clip)">
      <rect width="30" height="30" fill="#fff"/>
      <rect width="30" height="10" fill="#C6363C"/>
      <rect y="10" width="30" height="10" fill="#0C4076"/>
      <rect y="20" width="30" height="10" fill="#fff"/>
    </g>
  </svg>
);

const FlagGB = () => (
  <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
    <clipPath id="flag-gb-clip">
      <circle cx="15" cy="15" r="15"/>
    </clipPath>
    <g clipPath="url(#flag-gb-clip)">
      <rect width="30" height="30" fill="#012169"/>
      <path d="M0,0 L30,30 M30,0 L0,30" stroke="#fff" strokeWidth="4"/>
      <path d="M0,0 L30,30 M30,0 L0,30" stroke="#C8102E" strokeWidth="2.5"/>
      <path d="M15,0 V30 M0,15 H30" stroke="#fff" strokeWidth="6"/>
      <path d="M15,0 V30 M0,15 H30" stroke="#C8102E" strokeWidth="4"/>
    </g>
  </svg>
);

export function LocaleSwitch({ locale, onToggle }) {
  const isSr = locale === 'sr';

  return (
    <label
      className="locale-switch"
      aria-label={isSr ? 'Switch to English' : 'Promeni na srpski'}
      title={isSr ? 'Switch to English' : 'Promeni na srpski'}
    >
      <input
        type="checkbox"
        checked={isSr}
        onChange={onToggle}
      />
      <span className="locale-switch__slider">
        <span className="locale-switch__flag">
          {isSr ? <FlagSR /> : <FlagGB />}
        </span>
      </span>
    </label>
  );
}