import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const AddCompetitionForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    create_news: false,
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const { title, date, location, description, create_news } = formData;

    if (!title || !date || !location) {
      setStatus({ success: false, message: 'Пожалуйста, заполните обязательные поля.' });
      return;
    }

    const { error } = await supabase.from('competitions').insert([
      { title, date, location, description, create_news }
    ]);

    if (error) {
      setStatus({ success: false, message: error.message });
    } else {
      setStatus({ success: true, message: 'Соревнование успешно добавлено!' });
      setFormData({ title: '', date: '', location: '', description: '', create_news: false });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Добавить соревнование</h2>

      <div>
        <label>Название*</label><br />
        <input name="title" value={formData.title} onChange={handleChange} required />
      </div>

      <div>
        <label>Дата*</label><br />
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
      </div>

      <div>
        <label>Место проведения*</label><br />
        <input name="location" value={formData.location} onChange={handleChange} required />
      </div>

      <div>
        <label>Описание</label><br />
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </div>

      <div>
        <label>
          <input type="checkbox" name="create_news" checked={formData.create_news} onChange={handleChange} />
          Создать новость автоматически
        </label>
      </div>

      <button type="submit">Сохранить</button>

      {status && (
        <div style={{ color: status.success ? 'green' : 'red', marginTop: '10px' }}>
          {status.message}
        </div>
      )}
    </form>
  );
};

export default AddCompetitionForm;
// AddCompetitionForm.js