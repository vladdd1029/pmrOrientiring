import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addClub } from '../../services/api';

export default function AddClubForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    region: '',
    contacts: ''
  });
  const [status, setStatus] = useState(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addClub,
    onError: err => setStatus({ success: false, message: err.message }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['clubs'] }),
    onSuccess: () => {
      setStatus({ success: true, message: 'Клуб добавлен!' });
      setFormData({ name: '', description: '', region: '', contacts: '' });
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
    if (!formData.name) {
      setStatus({ success: false, message: 'Введите название клуба.' });
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Добавить клуб</h2>
      <div>
        <label>Название*</label><br />
        <input name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Описание</label><br />
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </div>
      <div>
        <label>Регион</label><br />
        <input name="region" value={formData.region} onChange={handleChange} />
      </div>
      <div>
        <label>Контакты</label><br />
        <input name="contacts" value={formData.contacts} onChange={handleChange} />
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
