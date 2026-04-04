/* ============================================================
   HELPERS – utility funkcije
   ============================================================ */

/**
 * Formatira datum u čitljiv format.
 * @param {string} dateStr – ISO string, npr. "2026-04-10"
 * @param {string} locale  – 'sr' | 'en'
 * @returns {string} – "10. apr 2026." (sr) | "Apr 10, 2026" (en)
 */
export function formatDate(dateStr, locale = 'sr') {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === 'sr' ? 'sr-Latn-RS' : 'en-US', {
      day:   'numeric',
      month: 'short',
      year:  'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Formatira cenu sa oznakom valute.
 * @param {number} amount
 * @param {string} currency – default 'RSD'
 * @returns {string} – "1.200 RSD"
 */
export function formatPrice(amount, currency = 'RSD') {
  if (amount == null || isNaN(amount)) return '—';
  return `${Number(amount).toLocaleString('sr-RS')} ${currency}`;
}

/**
 * Formatira trajanje vožnje.
 * @param {number} minutes – ukupno minuta
 * @returns {string} – "1h 30min"
 */
export function formatDuration(minutes) {
  if (!minutes || isNaN(minutes)) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

/**
 * Formatira vreme (HH:MM).
 * @param {string} timeStr – "07:30:00" ili "07:30"
 * @returns {string} – "07:30"
 */
export function formatTime(timeStr) {
  if (!timeStr) return '—';
  return timeStr.substring(0, 5);
}

/**
 * Skraćuje dugačak tekst na zadati broj karaktera.
 * @param {string} text
 * @param {number} maxLength
 */
export function truncate(text, maxLength = 50) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '…';
}

/**
 * Inicijali iz punog imena.
 * @param {string} name – "Marko Petrović"
 * @returns {string} – "MP"
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Validacija kompanijskog emaila.
 * Odbacuje gmail, yahoo, hotmail, outlook, live domene.
 */
const PERSONAL_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com'];

export function isCompanyEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  return !PERSONAL_DOMAINS.includes(domain);
}

/**
 * Generiše URL query string iz objekta.
 * @param {Object} params
 * @returns {string} – "from=Beograd&to=Ni%C5%A1&date=2026-04-10"
 */
export function buildQueryString(params) {
  return Object.entries(params)
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}

/**
 * Parsira query string u objekat.
 * @param {string} queryString – "?from=Beograd&to=Ni%C5%A1"
 * @returns {Object}
 */
export function parseQueryString(queryString) {
  const params = new URLSearchParams(queryString);
  return Object.fromEntries(params.entries());
}

/**
 * Debounce – odlaže poziv funkcije.
 * @param {Function} fn
 * @param {number} delay – ms
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Klasifikuje broj slobodnih mesta u kategoriju.
 * @param {number} seats
 * @returns {'full'|'low'|'available'}
 */
export function getSeatAvailability(seats) {
  if (seats === 0) return 'full';
  if (seats <= 1)  return 'low';
  return 'available';
}
