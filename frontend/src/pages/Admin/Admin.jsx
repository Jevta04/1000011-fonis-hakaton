import { useState, useEffect } from 'react';
import { Users, Car, CheckCircle, Building2, Route, Coins, TrendingUp, Download } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { AdminTable } from '../../components/admin/AdminTable/AdminTable';
import {
  adminGetUsers, adminGetAllRides, adminGetCompanies,
  adminDeleteUser, adminDeleteRide, adminGetStats,
} from '../../services/apiService';
import './Admin.css';

const TABS = [
  { key: 'users',     label: 'Korisnici' },
  { key: 'rides',     label: 'Vožnje' },
  { key: 'companies', label: 'Kompanije' },
  { key: 'earnings',  label: 'Zarade vozača' },
];

const USER_COLUMNS = [
  { key: 'id',              label: 'ID' },
  { key: 'name',            label: 'Ime i prezime' },
  { key: 'email',           label: 'Email' },
  { key: 'phone',           label: 'Telefon' },
  { key: 'company',         label: 'Kompanija' },
  { key: 'role',            label: 'Uloga',
    render: (val) => <span className={`admin-badge admin-badge--${val}`}>{val}</span> },
  { key: 'driver_rides',    label: 'Vožnje (vozač)' },
  { key: 'passenger_rides', label: 'Vožnje (putnik)' },
];

const RIDE_COLUMNS = [
  { key: 'id',             label: 'ID' },
  { key: 'from',           label: 'Od' },
  { key: 'to',             label: 'Do' },
  { key: 'date',           label: 'Datum' },
  { key: 'driver',         label: 'Vozač' },
  { key: 'seats',          label: 'Slobodna mesta' },
  { key: 'passengers',     label: 'Putnici' },
  { key: 'distance_km',    label: 'Distanca (km)' },
  { key: 'price_per_seat', label: 'Cena / osobi' },
  { key: 'total_cost',     label: 'Ukupna cena' },
  { key: 'vehicle',        label: 'Vozilo' },
];

const COMPANY_COLUMNS = [
  { key: 'id',          label: 'ID' },
  { key: 'name',        label: 'Naziv' },
  { key: 'pib',         label: 'PIB' },
  { key: 'users_count', label: 'Korisnici' },
];

const EARNINGS_COLUMNS = [
  { key: 'name',             label: 'Vozač' },
  { key: 'email',            label: 'Email' },
  { key: 'total_rides',      label: 'Broj vožnji' },
  { key: 'total_passengers', label: 'Ukupno putnika' },
  { key: 'total_km',         label: 'Pređeno km',
    render: (val) => val ? `${parseFloat(val).toFixed(1)} km` : '—' },
  { key: 'total_earned',     label: 'Zarada (din)',
    render: (val) => val ? <strong>{Math.round(parseFloat(val))} din</strong> : '—' },
];

function exportCsv(columns, rows, filename) {
  const header = columns.map((c) => c.label).join(';');
  const body = rows.map((row) =>
    columns.map((c) => {
      const v = row[c.key];
      return v !== null && v !== undefined ? String(v).replace(/;/g, ',') : '';
    }).join(';')
  ).join('\n');
  const blob = new Blob(['\uFEFF' + header + '\n' + body], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function Admin() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('users');
  const [data, setData]           = useState({ users: [], rides: [], companies: [], earnings: [] });
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [usersRes, ridesRes, companiesRes, statsRes] = await Promise.allSettled([
          adminGetUsers(), adminGetAllRides(), adminGetCompanies(), adminGetStats(),
        ]);
        const statsData = statsRes.status === 'fulfilled' ? statsRes.value.data : null;
        setData({
          users:     usersRes.status     === 'fulfilled' ? (usersRes.value.data?.data     || []) : [],
          rides:     ridesRes.status     === 'fulfilled' ? (ridesRes.value.data?.data     || []) : [],
          companies: companiesRes.status === 'fulfilled' ? (companiesRes.value.data?.data || companiesRes.value.data || []) : [],
          earnings:  statsData?.driver_earnings || [],
        });
        if (statsData) setStats(statsData);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Obrisati korisnika "${user.name}"?`)) return;
    try {
      await adminDeleteUser(user.id);
      setData((p) => ({ ...p, users: p.users.filter((u) => u.id !== user.id) }));
    } catch (err) { console.error(err); }
  };

  const handleDeleteRide = async (ride) => {
    if (!window.confirm(`Obrisati vožnju #${ride.id}?`)) return;
    try {
      await adminDeleteRide(ride.id);
      setData((p) => ({ ...p, rides: p.rides.filter((r) => r.id !== ride.id) }));
    } catch (err) { console.error(err); }
  };

  const colMap    = { users: USER_COLUMNS, rides: RIDE_COLUMNS, companies: COMPANY_COLUMNS, earnings: EARNINGS_COLUMNS };
  const csvNames  = { users: 'korisnici.csv', rides: 'voznje.csv', companies: 'kompanije.csv', earnings: 'zarade.csv' };

  const STAT_ITEMS = [
    { Icon: Users,       label: 'Korisnici',       value: stats?.total_users     ?? '—' },
    { Icon: Car,         label: 'Vožnje ukupno',   value: stats?.total_rides     ?? '—' },
    { Icon: CheckCircle, label: 'Aktivne vožnje',  value: stats?.active_rides    ?? '—' },
    { Icon: Building2,   label: 'Kompanije',       value: stats?.total_companies ?? '—' },
    { Icon: Route,       label: 'Ukupno km',       value: stats ? `${stats.total_km} km` : '—' },
    { Icon: Coins,       label: 'Avg. cena/osobi', value: stats ? `${stats.avg_price} din` : '—' },
    { Icon: TrendingUp,  label: 'Avg. distanca',   value: stats ? `${stats.avg_distance} km` : '—' },
    { Icon: Users,       label: 'Ukupno putnika',  value: stats?.total_passengers ?? '—' },
  ];

  return (
    <div className="admin page-enter">
      <div className="container">
        <div className="admin__header">
          <h1 className="admin__title">{t('admin_panel')}</h1>
        </div>

        {stats && (
          <div className="admin__stats">
            {STAT_ITEMS.map(({ Icon, label, value }) => (
              <div key={label} className="admin__stat-card">
                <span className="admin__stat-icon"><Icon size={24} strokeWidth={1.5} /></span>
                <div className="admin__stat-info">
                  <span className="admin__stat-value">{value}</span>
                  <span className="admin__stat-label">{label}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="admin__tabs-row">
          <div className="admin__tabs" role="tablist">
            {TABS.map(({ key, label }) => (
              <button key={key} role="tab" aria-selected={activeTab === key}
                className={`admin__tab ${activeTab === key ? 'admin__tab--active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {label}
                <span className="admin__tab-count">{data[key]?.length ?? 0}</span>
              </button>
            ))}
          </div>

          <button
            className="admin__export-btn"
            onClick={() => exportCsv(colMap[activeTab], data[activeTab], csvNames[activeTab])}
            title="Eksportuj CSV"
          >
            <Download size={15} /> CSV
          </button>
        </div>

        <div role="tabpanel">
          <AdminTable
            columns={colMap[activeTab]}
            data={data[activeTab] || []}
            loading={loading}
            onDelete={
              activeTab === 'users'  ? handleDeleteUser  :
              activeTab === 'rides'  ? handleDeleteRide  : undefined
            }
            emptyMessage={t('no_results')}
          />
        </div>
      </div>
    </div>
  );
}
