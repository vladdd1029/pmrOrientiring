// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useHistory } from 'react-router-dom';      // ← импортируем
import {
  fetchProfile,
  updateProfile,
  fetchMyApplications,
  applyTrainerApplication,
  fetchClubs
} from '../services/api';
import { formatRUDate } from '../utils/formatDate';
import LoadingElement from '../components/LoadingElement';
import { supabase } from '../services/supabaseClient';

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const history = useHistory();
  const [profile, setProfile] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    chip_number: '',
    phone: '',
    team_id: '',
    birthdate: ''
  });
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!user) history.push('/'); // редирект на главную, если нет user
    setLoading(true);
    (async () => {
      try {
        const p = await fetchProfile(user.id);
        setProfile(p)
        setFormData({
          first_name: p.first_name || '',
          last_name: p.last_name || '',
          middle_name: p.middle_name || '',
          chip_number: p.chip_number || '',
          phone: p.phone || '',
          team_id: p.team_id || '',
          birthdate: p.birthdate || ''
        });
        setClubs(await fetchClubs());
        setApps(await fetchMyApplications(user.id));
      } catch (err) {
        console.error(err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error.message);
    } else {
      setUser(null);
      history.push('/');                              // ← редирект на главную
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    setStatus(null);
    try {
      // Выполняем обновление
      await updateProfile(user.id, formData);
      // После обновления заново запрашиваем профиль, чтобы получить все поля
      const fresh = await fetchProfile(user.id);
      setProfile(fresh);
      setStatus({ success: true, message: 'Профиль сохранён.' });
    } catch (err) {
      console.error('❌ updateProfile error object:', err);
      // Показываем реальное сообщение от Supabase, а не фиксированный текст
      setStatus({ success: false, message: `Ошибка сохранения: ${err.message}` });
    }
  };

  const handleApply = async () => {
    if (!profile.team_id) {
      setStatus({ success: false, message: 'Сначала выберите клуб в профиле.' });
      return;
    }
    setStatus(null);
    try {
      await applyTrainerApplication(user.id);
      setApps(await fetchMyApplications(user.id));
      setStatus({ success: true, message: 'Заявка отправлена.' });
    } catch (err) {
      setStatus({ success: false, message: err.message });
    }
  };



  if (loading) return <div>
    <p><br /><br /><br />
    </p>
    <LoadingElement />
  </div>;
  // Показываем форму даже если profile==null, но информируем об ошибке
  if (!profile) {
    return (
      <div style={{ padding: 20 }}>
        <p style={{ color: 'red' }}>Не удалось загрузить профиль.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Мой профиль</h1>

      <form onSubmit={handleSave}>
        <div className='FIO-inputs'>
          <div>
            <label>Имя</label><br />
            <input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Фамилия</label><br />
            <input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Отчество</label><br />
            <input
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* далее уже были Чип-номер, Телефон, Команда, ДР */}
        <div>
          <label>Чип-номер</label><br />
          <input
            name="chip_number"
            value={formData.chip_number}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Телефон</label><br />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Команда</label><br />
          <select
            name="team_id"
            value={formData.team_id}
            onChange={handleChange}
          >
            <option value="">— Не выбрано —</option>
            {clubs.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Дата рождения</label><br />
          <input
            name="birthdate"
            type="date"
            value={formData.birthdate}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Сохранить</button>
      </form>

      {status && (
        <div style={{ color: status.success ? 'green' : 'red', marginTop: 10 }}>
          {status.message}
        </div>
      )}
      <button onClick={handleLogout} className="logout-button">
        Выйти
      </button>

      <h2 style={{ marginTop: 30 }}>Заявки на роль тренера</h2>
      {apps.length === 0 && <p>Заявок нет.</p>}
      {apps.length > 0 && (
        <ul>
          {apps.map(app => (
            <li key={app.id}>
              Статус: <strong>{app.status}</strong>, подана: {formatRUDate(app.submitted_at)}
            </li>
          ))}
        </ul>
      )}

      {/* Кнопка отправки заявки, если user и ещё не было pending */}
      {!apps.some(a => a.status === 'pending') && profile.role === 'user' && (
        <button onClick={handleApply} style={{ marginTop: 10 }}>
          Отправить заявку тренера
        </button>
      )}
      {apps.some(a => a.status === 'pending') && (
        <p>Ваша заявка на рассмотрении.</p>
      )}
    </div>
  );
}
