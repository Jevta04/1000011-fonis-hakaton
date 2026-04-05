import { useState, useEffect, useRef } from 'react';
import { Users, Car, CheckCircle, Building2, Route, Coins, TrendingUp, Download, X } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTheme } from '../../hooks/useTheme';
import { AdminTable } from '../../components/admin/AdminTable/AdminTable';
import {
  adminGetUsers, adminGetAllRides, adminGetCompanies,
  adminDeleteUser, adminDeleteRide, adminGetStats,
  adminUpdateUser, adminUpdateRide, adminGetCharts,
} from '../../services/apiService';
import './Admin.css';

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
  const { isDark } = useTheme();

  const TABS = [
    { key: 'users',     label: t('admin_users') },
    { key: 'rides',     label: t('admin_rides') },
    { key: 'companies', label: t('admin_companies') },
    { key: 'earnings',  label: t('admin_tab_earnings') },
  ];

  const USER_COLUMNS = [
    { key: 'id',              label: 'ID' },
    { key: 'name',            label: t('admin_col_full_name') },
    { key: 'email',           label: 'Email' },
    { key: 'phone',           label: t('phone') },
    { key: 'company',         label: t('company') },
    { key: 'role',            label: t('admin_col_role'),
      render: (val) => <span className={`admin-badge admin-badge--${val}`}>{val}</span> },
    { key: 'driver_rides',    label: t('admin_col_driver_rides') },
    { key: 'passenger_rides', label: t('admin_col_passenger_rides') },
  ];

  const RIDE_COLUMNS = [
    { key: 'id',             label: 'ID' },
    { key: 'from',           label: t('admin_col_od') },
    { key: 'to',             label: t('admin_col_do') },
    { key: 'date',           label: t('date') },
    { key: 'driver',         label: t('driver') },
    { key: 'seats',          label: t('admin_col_free_seats') },
    { key: 'passengers',     label: t('passengers') },
    { key: 'distance_km',    label: t('admin_col_distance_km') },
    { key: 'price_per_seat', label: t('admin_col_price_per_seat') },
    { key: 'total_cost',     label: t('admin_col_total_cost') },
    { key: 'vehicle',        label: t('vehicle') },
  ];

  const COMPANY_COLUMNS = [
    { key: 'id',          label: 'ID' },
    { key: 'name',        label: t('admin_col_company_name') },
    { key: 'pib',         label: t('admin_col_pib') },
    { key: 'users_count', label: t('admin_users') },
  ];

  const EARNINGS_COLUMNS = [
    { key: 'name',             label: t('driver') },
    { key: 'email',            label: 'Email' },
    { key: 'total_rides',      label: t('admin_col_total_rides') },
    { key: 'total_passengers', label: t('admin_col_total_passengers') },
    { key: 'total_km',         label: t('admin_col_total_km'),
      render: (val) => val ? `${parseFloat(val).toFixed(1)} km` : '—' },
    { key: 'total_earned',     label: t('admin_col_total_earned'),
      render: (val) => val ? <strong>{Math.round(parseFloat(val))} din</strong> : '—' },
  ];

  const [activeTab, setActiveTab] = useState('users');
  const [data, setData]           = useState({ users: [], rides: [], companies: [], earnings: [] });
  const [stats, setStats]         = useState(null);
  const [charts, setCharts]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm]   = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const kmChartRef   = useRef(null);
  const passChartRef = useRef(null);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [usersRes, ridesRes, companiesRes, statsRes, chartsRes] = await Promise.allSettled([
          adminGetUsers(), adminGetAllRides(), adminGetCompanies(), adminGetStats(), adminGetCharts(),
        ]);
        const statsData  = statsRes.status  === 'fulfilled' ? statsRes.value.data  : null;
        const chartsData = chartsRes.status === 'fulfilled' ? chartsRes.value.data : null;
        setData({
          users:     usersRes.status     === 'fulfilled' ? (usersRes.value.data?.data     || []) : [],
          rides:     ridesRes.status     === 'fulfilled' ? (ridesRes.value.data?.data     || []) : [],
          companies: companiesRes.status === 'fulfilled' ? (companiesRes.value.data?.data || companiesRes.value.data || []) : [],
          earnings:  statsData?.driver_earnings || [],
        });
        if (statsData)  setStats(statsData);
        if (chartsData) setCharts(chartsData);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  // Draw Google Charts when data or theme changes
  useEffect(() => {
    if (!charts?.daily?.length) return;

    const textColor  = isDark ? '#f5f7f8' : '#191a19';
    const gridColor  = isDark ? '#2d3d2d' : '#e2e6ea';
    const daily = charts.daily;

    const drawCharts = () => {
      // KM — area chart
      if (kmChartRef.current) {
        const w = kmChartRef.current.offsetWidth || 320;
        const kmData = new window.google.visualization.DataTable();
        kmData.addColumn('string', 'Dan');
        kmData.addColumn('number', 'km');
        kmData.addRows(daily.map((d) => [d.label, d.km]));
        new window.google.visualization.AreaChart(kmChartRef.current).draw(kmData, {
          title: '', width: w, height: 220,
          legend: 'none',
          colors: ['#4e9f3d'],
          backgroundColor: 'transparent',
          curveType: 'function',
          areaOpacity: 0.35,
          chartArea: { left: 44, right: 12, top: 8, bottom: 52 },
          hAxis: { textStyle: { color: textColor, fontSize: 11 }, gridlines: { color: 'transparent' } },
          vAxis: { textStyle: { color: textColor, fontSize: 11 }, gridlines: { color: gridColor }, minValue: 0 },
          pointSize: 5,
          pointShape: 'circle',
          tooltip: { trigger: 'both' },
        });
      }

      // Passengers — column chart
      if (passChartRef.current) {
        const w = passChartRef.current.offsetWidth || 320;
        const passData = new window.google.visualization.DataTable();
        passData.addColumn('string', 'Dan');
        passData.addColumn('number', 'Putnici');
        passData.addRows(daily.map((d) => [d.label, d.passengers]));
        new window.google.visualization.ColumnChart(passChartRef.current).draw(passData, {
          title: '', width: w, height: 220,
          legend: 'none',
          colors: ['#4e9f3d'],
          backgroundColor: 'transparent',
          chartArea: { left: 36, right: 12, top: 8, bottom: 52 },
          hAxis: { textStyle: { color: textColor, fontSize: 11 }, gridlines: { color: 'transparent' } },
          vAxis: { textStyle: { color: textColor, fontSize: 11 }, gridlines: { color: gridColor }, minValue: 0 },
          bar: { groupWidth: '55%' },
          tooltip: { trigger: 'both' },
        });
      }
    };

    const onResize = () => drawCharts();
    window.addEventListener('resize', onResize);

    if (window.google?.visualization) {
      drawCharts();
    } else {
      const existing = document.querySelector('script[src*="gstatic.com/charts"]');
      if (!existing) {
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/charts/loader.js';
        script.onload = () => {
          window.google.charts.load('current', { packages: ['corechart'] });
          window.google.charts.setOnLoadCallback(drawCharts);
        };
        document.head.appendChild(script);
      } else {
        window.google.charts.setOnLoadCallback(drawCharts);
      }
    }

    return () => window.removeEventListener('resize', onResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charts, isDark]);

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`${t('delete')} "${user.name}"?`)) return;
    try {
      await adminDeleteUser(user.id);
      setData((p) => ({ ...p, users: p.users.filter((u) => u.id !== user.id) }));
    } catch (err) { console.error(err); }
  };

  const handleDeleteRide = async (ride) => {
    if (!window.confirm(`${t('delete')} #${ride.id}?`)) return;
    try {
      await adminDeleteRide(ride.id);
      setData((p) => ({ ...p, rides: p.rides.filter((r) => r.id !== ride.id) }));
    } catch (err) { console.error(err); }
  };

  const handleEditUser = (user) => {
    setEditForm({ ime: user.name?.split(' ')[0] ?? '', prezime: user.name?.split(' ').slice(1).join(' ') ?? '', uloga: user.role, brojTelefona: user.phone === '—' ? '' : user.phone });
    setEditModal({ type: 'user', row: user });
  };

  const handleEditRide = (ride) => {
    setEditForm({ seats: ride.seats });
    setEditModal({ type: 'ride', row: ride });
  };

  const handleEditSave = async () => {
    if (!editModal) return;
    setEditSaving(true);
    try {
      if (editModal.type === 'user') {
        await adminUpdateUser(editModal.row.id, editForm);
        const fullName = `${editForm.ime} ${editForm.prezime}`.trim();
        setData((p) => ({ ...p, users: p.users.map((u) => u.id === editModal.row.id ? { ...u, name: fullName, role: editForm.uloga, phone: editForm.brojTelefona || '—' } : u) }));
      } else {
        await adminUpdateRide(editModal.row.id, editForm);
        setData((p) => ({ ...p, rides: p.rides.map((r) => r.id === editModal.row.id ? { ...r, seats: editForm.seats } : r) }));
      }
      setEditModal(null);
    } catch (err) { console.error(err); }
    finally { setEditSaving(false); }
  };

  const colMap   = { users: USER_COLUMNS, rides: RIDE_COLUMNS, companies: COMPANY_COLUMNS, earnings: EARNINGS_COLUMNS };
  const csvNames = { users: 'users.csv', rides: 'rides.csv', companies: 'companies.csv', earnings: 'earnings.csv' };

  const STAT_ITEMS = [
    { Icon: Users,       label: t('total_users'),           value: stats?.total_users     ?? '—' },
    { Icon: Car,         label: t('admin_stat_total_rides'), value: stats?.total_rides     ?? '—' },
    { Icon: CheckCircle, label: t('admin_stat_active_rides'),value: stats?.active_rides    ?? '—' },
    { Icon: Building2,   label: t('total_companies'),        value: stats?.total_companies ?? '—' },
    { Icon: Route,       label: t('admin_stat_total_km'),    value: stats ? `${stats.total_km} km` : '—' },
    { Icon: Coins,       label: t('admin_stat_avg_price'),   value: stats ? `${stats.avg_price} din` : '—' },
    { Icon: TrendingUp,  label: t('admin_stat_avg_distance'),value: stats ? `${stats.avg_distance} km` : '—' },
    { Icon: Users,       label: t('total_passengers'),       value: stats?.total_passengers ?? '—' },
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

        {charts && (
          <div className="admin__charts-row">
            {charts.total_revenue > 0 && (
              <div className="admin__revenue-card">
                <TrendingUp size={22} strokeWidth={1.5} />
                <div>
                  <span className="admin__revenue-value">{charts.total_revenue.toLocaleString()} din</span>
                  <span className="admin__revenue-label">{t('total_revenue')}</span>
                </div>
              </div>
            )}
            <div className="admin__charts">
              <div className="admin__chart-card">
                <p className="admin__chart-title">{t('charts_km')}</p>
                <div ref={kmChartRef} className="admin__chart" />
              </div>
              <div className="admin__chart-card">
                <p className="admin__chart-title">{t('charts_passengers')}</p>
                <div ref={passChartRef} className="admin__chart" />
              </div>
            </div>
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
            title={t('export_csv')}
          >
            <Download size={15} /> CSV
          </button>
        </div>

        <div role="tabpanel">
          <AdminTable
            columns={colMap[activeTab]}
            data={data[activeTab] || []}
            loading={loading}
            onEdit={
              activeTab === 'users' ? handleEditUser :
              activeTab === 'rides' ? handleEditRide : undefined
            }
            onDelete={
              activeTab === 'users'  ? handleDeleteUser  :
              activeTab === 'rides'  ? handleDeleteRide  : undefined
            }
            emptyMessage={t('no_results')}
          />
        </div>
      </div>

      {editModal && (
        <div className="admin-modal-overlay" onClick={() => setEditModal(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">
                {editModal.type === 'user' ? t('admin_edit_user') : t('admin_edit_ride')}
              </h3>
              <button className="admin-modal__close" onClick={() => setEditModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal__body">
              {editModal.type === 'user' && (
                <>
                  <label className="admin-modal__label">{t('ime')}
                    <input className="admin-modal__input" value={editForm.ime ?? ''} onChange={(e) => setEditForm((p) => ({ ...p, ime: e.target.value }))} />
                  </label>
                  <label className="admin-modal__label">{t('prezime')}
                    <input className="admin-modal__input" value={editForm.prezime ?? ''} onChange={(e) => setEditForm((p) => ({ ...p, prezime: e.target.value }))} />
                  </label>
                  <label className="admin-modal__label">{t('phone')}
                    <input className="admin-modal__input" value={editForm.brojTelefona ?? ''} onChange={(e) => setEditForm((p) => ({ ...p, brojTelefona: e.target.value }))} />
                  </label>
                  <label className="admin-modal__label">{t('admin_col_role')}
                    <select className="admin-modal__input" value={editForm.uloga ?? 'korisnik'} onChange={(e) => setEditForm((p) => ({ ...p, uloga: e.target.value }))}>
                      <option value="korisnik">korisnik</option>
                      <option value="admin">admin</option>
                    </select>
                  </label>
                </>
              )}
              {editModal.type === 'ride' && (
                <label className="admin-modal__label">{t('admin_col_free_seats')}
                  <input className="admin-modal__input" type="number" min="0" max="8" value={editForm.seats ?? 0} onChange={(e) => setEditForm((p) => ({ ...p, seats: parseInt(e.target.value, 10) }))} />
                </label>
              )}
            </div>

            <div className="admin-modal__footer">
              <button className="admin-modal__cancel" onClick={() => setEditModal(null)}>{t('discard')}</button>
              <button className="admin-modal__save" onClick={handleEditSave} disabled={editSaving}>
                {editSaving ? t('saving') : t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
