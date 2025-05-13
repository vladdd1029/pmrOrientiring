// src/components/forms/AddNewsForm.js
import React, { useState, useEffect } from 'react';
// CRUD-функции
import { fetchCompetitions, addNews } from '../../services/api';

export default function AddNewsForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    competition_id: ''
  });
  const [competitions, setCompetitions] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Загрузка списка соревнований через api.js
    fetchCompetitions()
      .then(data => setCompetitions(data))
      .catch(err => console.error('fetchCompetitions:', err.message));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const { title, content, competition_id } = formData;
    if (!title) {
      setStatus({ success: false, message: 'Введите заголовок.' });
      return;
    }

    try {
      // Вызов централизованной функции
      await addNews({
        title,
        content,
        competition_id: competition_id || null
      });
      setStatus({ success: true, message: 'Новость добавлена!' });
      setFormData({ title: '', content: '', competition_id: '' });
      if (onSuccess) onSuccess();
    } catch (error) {
      setStatus({ success: false, message: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Добавить новость</h2>
      <div>
        <label>Заголовок*</label><br/>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Содержание</label><br/>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Привязать к соревнованию</label><br/>
        <select
          name="competition_id"
          value={formData.competition_id}
          onChange={handleChange}
        >
          <option value="">— Без привязки —</option>
          {competitions.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>
      <button type="submit">Сохранить</button>
      {status && (
        <div style={{ color: status.success ? 'green' : 'red', marginTop: 10 }}>
          {status.message}
        </div>
      )}
    </form>
  );
};

