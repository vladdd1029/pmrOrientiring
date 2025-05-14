import React, { useState, useEffect } from 'react';
import { fetchAllApplications, reviewApplication } from '../services/api';
import { formatRUDate } from '../utils/formatDate';

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteMap, setNoteMap] = useState({});
  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    fetchAllApplications()
      .then(setApps)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleReview = async (id, newStatus) => {
    try {
      await reviewApplication(id, { status: newStatus, note: noteMap[id] || '' });
      setApps(apps.map(a => a.id === id ? { ...a, status: newStatus, reviewed_at: new Date().toISOString(), admin_id: /* текущий админ */ null } : a));
      setNoteMap(prev => ({ ...prev, [id]: '' }));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Загрузка заявок…</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Заявки на роль тренера</h1>
      {apps.length === 0 ? (
        <p>Новых заявок нет.</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Пользователь</th>
              <th>Подана</th>
              <th>Статус</th>
              <th>Заметка</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {apps.map(app => (
              <tr key={app.id}>
                <td>{app.user.first_name} {app.user.last_name}</td>
                <td>{app.club?.name || '–'}</td>
                <td>{formatRUDate(app.submitted_at)}</td>
                <td>{app.status}</td>
                <td>
                  <input
                    type="text"
                    value={noteMap[app.id] || ''}
                    onChange={e => setNoteMap({ ...noteMap, [app.id]: e.target.value })}
                  />
                </td>
                <td>
                  <button onClick={() => handleReview(app.id, 'approved')} disabled={app.status !== 'pending'}>
                    Одобрить
                  </button>
                  <button onClick={() => handleReview(app.id, 'rejected')} disabled={app.status !== 'pending'} style={{ marginLeft: 6 }}>
                    Отклонить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
