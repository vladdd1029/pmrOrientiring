import React, { useState, useEffect } from 'react';
import { fetchProfile, updateProfile, fetchMyApplications, applyTrainerApplication } from '../services/api';
import { fetchClubs } from '../services/api';
import { formatRUDate } from '../utils/formatDate';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [formData, setFormData] = useState({
    chip_number: '',
    phone: '',
    team_id: '',
    birthdate: ''
  });
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  // Загрузка профиля, клубов и заявок
  useEffect(() => {
    async function load() {
      try {
        const p = await fetchProfile();
        setProfile(p);
        setFormData({
          chip_number: p.chip_number || '',
          phone: p.phone || '',
          team_id: p.team_id || '',
          birthdate: p.birthdate || ''
        });
        const clubList = await fetchClubs();
        setClubs(clubList);
        const myApps = await fetchMyApplications();
        setApps(myApps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    setStatus(null);
    try {
      const updated = await updateProfile(formData);
      setProfile(updated);
      setStatus({ success: true, message: 'Профиль сохранён.' });
    } catch (err) {
      setStatus({ success: false, message: err.message });
    }
  };

  const handleApply = async () => {
    setStatus(null);
    try {
      await applyTrainerApplication();
      const myApps = await fetchMyApplications();
      setApps(myApps);
      setStatus({ success: true, message: 'Заявка отправлена.' });
    } catch (err) {
      setStatus({ success: false, message: err.message });
    }
  };

  if (loading) return <p>Загрузка профиля…</p>;
  if (!profile) return <p>Профиль не найден.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Мой профиль</h1>
      <form onSubmit={handleSave}>
        <div>
          <label>Чип-номер</label><br/>
          <input name="chip_number" value={formData.chip_number} onChange={handleChange} />
        </div>
        <div>
          <label>Телефон</label><br/>
          <input name="phone" value={formData.phone} onChange={handleChange} />
        </div>
        <div>
          <label>Команда</label><br/>
          <select name="team_id" value={formData.team_id} onChange={handleChange}>
            <option value="">— Не выбрано —</option>
            {clubs.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Дата рождения</label><br/>
          <input name="birthdate" type="date" value={formData.birthdate} onChange={handleChange} />
        </div>
        <button type="submit">Сохранить</button>
      </form>
      {status && (
        <div style={{ color: status.success ? 'green' : 'red', marginTop: 10 }}>
          {status.message}
        </div>
      )}

      <h2 style={{ marginTop: 30 }}>Заявки на роль тренера</h2>
      {apps.length === 0 ? (
        <p>Заявок нет.</p>
      ) : (
        <ul>
          {apps.map(app => (
            <li key={app.id}>
              Статус: <strong>{app.status}</strong>, подана: {formatRUDate(app.submitted_at)}
            </li>
          ))}
        </ul>
      )}
      {profile.role === 'user' && apps.every(a => a.status === 'pending') === false && (
        <button onClick={handleApply} style={{ marginTop: 10 }}>
          Отправить заявку тренера
        </button>
      )}
      {profile.role === 'user' && apps.some(a => a.status === 'pending') && (
        <p>Ваша заявка на рассмотрении.</p>
      )}
    </div>
  );
}
