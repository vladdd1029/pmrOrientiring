import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addCompetition } from '../../services/api';

export default function AddCompetitionForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    create_news: false,
  });
  const [status, setStatus] = useState(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addCompetition,
    onError: (err, newComp, context) => {
      queryClient.setQueryData(['competitions'], context.previous);
      setStatus({ success: false, message: err.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['competitions'] });
    },
    onSuccess: () => {
      setStatus({ success: true, message: 'Соревнование успешно добавлено!' });
      setFormData({
        title: '',
        date: '',
        location: '',
        description: '',
        create_news: false,
      });
      if (onSuccess) onSuccess();
    }
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(fd => ({
      ...fd,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setStatus(null);
    const { title, date, location } = formData;
    if (!title || !date || !location) {
      setStatus({ success: false, message: 'Заполните обязательные поля.' });
      return;
    }
    mutation.mutate(formData);
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
        <input name="date" type="date" value={formData.date} onChange={handleChange} required />
      </div>
      <div>
        <label>Место*</label><br />
        <input name="location" value={formData.location} onChange={handleChange} required />
      </div>
      <div>
        <label>Описание</label><br />
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </div>
      <div>
        <label>
          <input
            name="create_news"
            type="checkbox"
            checked={formData.create_news}
            onChange={handleChange}
          /> Автоматически создать новость
        </label>
      </div>
      <button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? 'Сохраняем…' : 'Сохранить'}
      </button>

      {status && (
        <div style={{ color: status.success ? 'green' : 'red', marginTop: 10 }}>
          {status.message}
        </div>
      )}
    </form>
  );
}
