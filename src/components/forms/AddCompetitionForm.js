import React, { useState } from 'react';
import { addCompetition } from '../../services/api';

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

    try {
      // Вызов централизованной функции
      await addCompetition({ title, date, location, description, create_news });
      setStatus({ success: true, message: 'Соревнование успешно добавлено!' });
      setFormData({ title: '', date: '', location: '', description: '', create_news: false });
      if (onSuccess) onSuccess();
    } catch (error) {
      // Ошибка из addCompetition пробрасывается вверх
      setStatus({ success: false, message: error.message });
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