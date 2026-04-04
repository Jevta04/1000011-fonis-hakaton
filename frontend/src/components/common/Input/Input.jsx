import './Input.css';

/**
 * Input – kontrolisano input polje sa label-om i error porukom.
 *
 * @param {string} id
 * @param {string} label
 * @param {string} error
 * @param {React.ReactNode} icon – opciona ikonica levo
 * @param {string} hint – pomoćni tekst ispod polja
 */
export function Input({
  id,
  label,
  error,
  hint,
  icon,
  className = '',
  type = 'text',
  required = false,
  ...rest
}) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-group__label">
          {label}
          {required && <span className="input-group__required" aria-hidden="true"> *</span>}
        </label>
      )}

      <div className="input-group__wrapper">
        {icon && <span className="input-group__icon" aria-hidden="true">{icon}</span>}
        <input
          id={inputId}
          type={type}
          className={`input-group__field ${icon ? 'input-group__field--with-icon' : ''}`}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          required={required}
          {...rest}
        />
      </div>

      {error && (
        <p id={`${inputId}-error`} className="input-group__error" role="alert">
          {error}
        </p>
      )}

      {hint && !error && (
        <p id={`${inputId}-hint`} className="input-group__hint">
          {hint}
        </p>
      )}
    </div>
  );
}
