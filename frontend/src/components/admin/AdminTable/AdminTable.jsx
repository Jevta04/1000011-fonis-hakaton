import { useTranslation } from '../../../hooks/useTranslation';
import './AdminTable.css';

/**
 * AdminTable – generička tabela za admin panel.
 *
 * @param {Array}    columns   – [{ key, label, render? }]
 * @param {Array}    data      – niz objekata
 * @param {Function} onApprove – callback(row) za odobravanje
 * @param {Function} onDelete  – callback(row) za brisanje
 * @param {boolean}  loading
 * @param {string}   emptyMessage
 *
 * Primer kolona:
 *   columns={[
 *     { key: 'name',  label: 'Ime' },
 *     { key: 'email', label: 'Email' },
 *     { key: 'status', label: 'Status', render: (val) => <Badge>{val}</Badge> },
 *   ]}
 */
export function AdminTable({
  columns = [],
  data = [],
  onApprove,
  onEdit,
  onDelete,
  loading = false,
  emptyMessage,
}) {
  const { t } = useTranslation();
  const hasActions = onApprove || onEdit || onDelete;

  if (loading) {
    return (
      <div className="admin-table__loading" role="status">
        <span className="admin-table__spinner" aria-hidden="true" />
        <span>{t('loading')}</span>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="admin-table__empty">
        <span aria-hidden="true">📭</span>
        <p>{emptyMessage || t('no_results')}</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">
      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="admin-table__th" scope="col">
                  {col.label}
                </th>
              ))}
              {hasActions && (
                <th className="admin-table__th admin-table__th--actions" scope="col">
                  {t('actions')}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={row.id ?? rowIndex} className="admin-table__row">
                {columns.map((col) => (
                  <td key={col.key} className="admin-table__td">
                    {col.render
                      ? col.render(row[col.key], row)
                      : (row[col.key] ?? '—')}
                  </td>
                ))}
                {hasActions && (
                  <td className="admin-table__td admin-table__td--actions">
                    {onApprove && (
                      <button
                        className="admin-table__action admin-table__action--approve"
                        onClick={() => onApprove(row)}
                        title={t('approve')}
                      >
                        ✓ {t('approve')}
                      </button>
                    )}
                    {onEdit && (
                      <button
                        className="admin-table__action admin-table__action--edit"
                        onClick={() => onEdit(row)}
                        title={t('edit')}
                      >
                        ✎ {t('edit')}
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="admin-table__action admin-table__action--delete"
                        onClick={() => onDelete(row)}
                        title={t('delete')}
                      >
                        ✕ {t('delete')}
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
