import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AddNewsForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    competition_id: ''
  });
  const [competitions, setCompetitions] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Загружаем список соревнований для селекта
    supabase
      .from('competitions')
      .select('id, title')
      .order('date', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error(error.message);
        else setCompetitions(data);
      });
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
    const { error } = await supabase
      .from('news')
      .insert([{ title, content, competition_id: competition_id || null }]);
    if (error) setStatus({ success: false, message: error.message });
    else {
      setStatus({ success: true, message: 'Новость добавлена!' });
      setFormData({ title: '', content: '', competition_id: '' });
      if (onSuccess) onSuccess();
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

export default AddNewsForm;
