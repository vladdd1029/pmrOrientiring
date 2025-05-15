import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCompetitions, addNews } from '../../services/api';

export default function AddNewsForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    competition_id: ''
  });
  const [status, setStatus] = useState(null);
  const queryClient = useQueryClient();

  // список соревнований
  const { data: competitions = [] } = useQuery({
    queryKey: ['competitionsList'],
    queryFn: fetchCompetitions,
    staleTime: 1000 * 60 * 5
  });

  // мутация добавления новости
  const mutation = useMutation({
    mutationFn: addNews,
    onError: err => setStatus({ success: false, message: err.message }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['competitions'] });
    },
    onSuccess: () => {
      setStatus({ success: true, message: 'Новость добавлена!' });
      setFormData({ title: '', content: '', competition_id: '' });
      if (onSuccess) onSuccess();
    }
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setStatus(null);
    const { title, content } = formData;
    if (!title) {
      setStatus({ success: false, message: 'Введите заголовок.' });
      return;
    }
    mutation.mutate({
      title,
      content,
      competition_id: formData.competition_id || null
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Добавить новость</h2>
      <div>
        <label>Заголовок*</label><br />
        <input name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <label>Содержание</label><br />
        <textarea name="content" value={formData.content} onChange={handleChange} />
      </div>
      <div>
        <label>Соревнование</label><br />
        <select name="competition_id" value={formData.competition_id} onChange={handleChange}>
          <option value="">— Без привязки —</option>
          {competitions.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
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
