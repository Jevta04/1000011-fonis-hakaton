import './Button.css';

/**
 * Button – višenamensko dugme sa varijantama.
 *
 * @param {'primary'|'secondary'|'ghost'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} fullWidth
 * @param {boolean} loading
 * @param {boolean} disabled
 * @param {React.ReactNode} icon – opciona ikonica (levo od teksta)
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon = null,
  className = '',
  type = 'button',
  onClick,
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth  ? 'btn--full'    : '',
    loading    ? 'btn--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      {!loading && icon && <span className="btn__icon">{icon}</span>}
      <span className="btn__label">{children}</span>
    </button>
  );
}
