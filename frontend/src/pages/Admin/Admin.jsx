import { useState, useEffect } from 'react';
import { Users, Car, CheckCircle, Building2 } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { AdminTable }     from '../../components/admin/AdminTable/AdminTable';
import {
  adminGetUsers, adminGetAllRides, adminGetCompanies,
  adminDeleteUser, adminDeleteRide, adminGetStats,
} from '../../services/apiService';
import './Admin.css';

const TABS = [
  { key: 'users',     labelKey: 'admin_users' },
  { key: 'rides',     labelKey: 'admin_rides' },
  { key: 'companies', labelKey: 'admin_companies' },
];

const USER_COLUMNS = [
  { key: 'id',      label: 'ID' },
  { key: 'name',    label: 'Ime' },
  { key: 'email',   label: 'Email' },
  { key: 'company', label: 'Kompanija' },
  { key: 'status',  label: 'Status',
    render: (val) => <span className={`admin-badge admin-badge--${val}`}>{val}</span>
  },
];

const RIDE_COLUMNS = [
  { key: 'id',     label: 'ID' },
  { key: 'from',   label: 'Od' },
  { key: 'to',     label: 'Do' },
  { key: 'date',   label: 'Datum' },
  { key: 'driver', label: 'Vozač' },
  { key: 'seats',  label: 'Mesta' },
  { key: 'price',  label: 'Cena' },
];

const COMPANY_COLUMNS = [
  { key: 'id',           label: 'ID' },
  { key: 'name',         label: 'Naziv' },
  { key: 'email_domain', label: 'Email domena' },
  { key: 'users_count',  label: 'Korisnici' },
  { key: 'rides_count',  label: 'Vožnje' },
];

export function Admin() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('users');
  const [data, setData]           = useState({ users: [], rides: [], companies: [] });
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [usersRes, ridesRes, companiesRes, statsRes] = await Promise.allSettled([
          adminGetUsers(), adminGetAllRides(), adminGetCompanies(), adminGetStats(),
        ]);
        setData({
          users:     usersRes.status     === 'fulfilled' ? (usersRes.value.data?.data     || usersRes.value.data     || []) : [],
          rides:     ridesRes.status     === 'fulfilled' ? (ridesRes.value.data?.data     || ridesRes.value.data     || []) : [],
          companies: companiesRes.status === 'fulfilled' ? (companiesRes.value.data?.data || companiesRes.value.data || []) : [],
        });
        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
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
      setData((prev) => ({ ...prev, users: prev.users.filter((u) => u.id !== user.id) }));
    } catch (err) { console.error(err); }
  };

  const handleDeleteRide = async (ride) => {
    if (!window.confirm(`Obrisati vožnju #${ride.id}?`)) return;
    try {
      await adminDeleteRide(ride.id);
      setData((prev) => ({ ...prev, rides: prev.rides.filter((r) => r.id !== ride.id) }));
    } catch (err) { console.error(err); }
  };

  const currentColumns =
    activeTab === 'users' ? USER_COLUMNS :
    activeTab === 'rides' ? RIDE_COLUMNS : COMPANY_COLUMNS;

  const STAT_ITEMS = [
    { Icon: Users,       label: t('total_users'),     value: stats?.total_users     ?? '—' },
    { Icon: Car,         label: t('total_rides'),     value: stats?.total_rides     ?? '—' },
    { Icon: CheckCircle, label: t('active_rides'),    value: stats?.active_rides    ?? '—' },
    { Icon: Building2,   label: t('total_companies'), value: stats?.total_companies ?? '—' },
  ];

  return (
    <div className="admin page-enter">
      <div className="container">
        <div className="admin__header">
          <h1 className="admin__title">{t('admin_panel')}</h1>
        </div>

        {/* Stat kartice */}
        {stats && (
          <div className="admin__stats">
            {STAT_ITEMS.map(({ Icon, label, value }) => (
              <div key={label} className="admin__stat-card">
                <span className="admin__stat-icon"><Icon size={28} strokeWidth={1.5} /></span>
                <div className="admin__stat-info">
                  <span className="admin__stat-value">{value}</span>
                  <span className="admin__stat-label">{label}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabovi */}
        <div className="admin__tabs" role="tablist">
          {TABS.map(({ key, labelKey }) => (
            <button key={key} role="tab" aria-selected={activeTab === key}
              className={`admin__tab ${activeTab === key ? 'admin__tab--active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {t(labelKey)}
              <span className="admin__tab-count">{data[key]?.length ?? 0}</span>
            </button>
          ))}
        </div>

        <div role="tabpanel">
          <AdminTable
            columns={currentColumns}
            data={data[activeTab] || []}
            loading={loading}
            onDelete={activeTab === 'users' ? handleDeleteUser : activeTab === 'rides' ? handleDeleteRide : undefined}
            emptyMessage={t('no_results')}
          />
        </div>
      </div>
    </div>
  );
}
