import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCompetitions, addNews } from '../../services/api';
import { supabase } from '../../services/supabaseClient';

export default function AddNewsForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    competition_id: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState(null);
  const queryClient = useQueryClient();

  const { data: competitions = [] } = useQuery({
    queryKey: ['competitionsList'],
    queryFn: fetchCompetitions,
    staleTime: 1000 * 60 * 5
  });

  const mutation = useMutation({
    mutationFn: addNews,
    onError: err => setStatus({ success: false, message: err.message }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['news'] }),
    onSuccess: () => {
      setStatus({ success: true, message: 'Новость добавлена!' });
      setFormData({ title: '', content: '', competition_id: '' });
      setImageFile(null);
      if (onSuccess) onSuccess();
    }
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleImageChange = e => {
    setImageFile(e.target.files[0] || null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(null);
    if (!formData.title) {
      setStatus({ success: false, message: 'Введите заголовок.' });
      return;
    }

    // Загрузка обложки
    let image_url = null;
    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { data: uploadData, error: upErr } = await supabase
        .storage.from('images').upload(fileName, imageFile, { cacheControl: '3600', upsert: false });
      if (upErr) {
        setStatus({ success: false, message: `Ошибка загрузки фото: ${upErr.message}` });
        return;
      }
      const { data: urlData, error: urlErr } = await supabase
        .storage.from('images').getPublicUrl(uploadData.path);
      if (urlErr || !urlData.publicUrl) {
        setStatus({ success: false, message: `Не удалось получить URL: ${urlErr?.message}` });
        return;
      }
      image_url = urlData.publicUrl;
    }

    // Мутация с image_url
    mutation.mutate({
      ...formData,
      competition_id: formData.competition_id || null,
      image_url
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Добавить новость</h2>
      <div>
        <label>Заголовок*</label><br/>
        <input name="title" value={formData.title} onChange={handleChange} required/>
      </div>
      <div>
        <label>Содержание</label><br/>
        <textarea name="content" value={formData.content} onChange={handleChange}/>
      </div>
      <div>
        <label>Привязать к соревнованию</label><br/>
        <select name="competition_id" value={formData.competition_id} onChange={handleChange}>
          <option value="">— Без привязки —</option>
          {competitions.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Обложка (изображение)</label><br/>
        <input type="file" accept="image/*" onChange={handleImageChange}/>
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
