// components/ThemeSwitch/ThemeSwitch.jsx
import './ThemeSwitch.css';

export function ThemeSwitch({ isDark, onToggle }) {
  return (
    <label className="theme-switch" aria-label="Promeni temu">
      <input
        type="checkbox"
        checked={isDark}
        onChange={onToggle}
      />
      <span className="theme-switch__slider" />
    </label>
  );
}