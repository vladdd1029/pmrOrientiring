import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addCompetition } from '../../services/api';
import { supabase } from '../../services/supabaseClient';

export default function AddCompetitionForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    create_news: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addCompetition,
    onMutate: async newComp => {
      await queryClient.cancelQueries({ queryKey: ['competitions'] });
      const previous = queryClient.getQueryData(['competitions']) || [];
      const tempId = `temp-${Date.now()}`;
      const optimistic = { id: tempId, ...newComp };
      queryClient.setQueryData(['competitions'], old => [...old, optimistic]);
      return { previous };
    },
    onError: (err, newComp, ctx) => {
      queryClient.setQueryData(['competitions'], ctx.previous);
      setStatus({ success: false, message: err.message });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['competitions'] }),
    onSuccess: () => {
      setStatus({ success: true, message: 'Соревнование добавлено!' });
      setFormData({ title: '', date: '', location: '', description: '', create_news: false });
      setImageFile(null);
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

  const handleImageChange = e => {
    setImageFile(e.target.files[0] || null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(null);
    const { title, date, location } = formData;
    if (!title || !date || !location) {
      setStatus({ success: false, message: 'Заполните обязательные поля.' });
      return;
    }

    // Загрузка обложки
    let image_url = null;
    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { data: uploadData, error: upErr } = await supabase
        .storage
        .from('images')
        .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });
      if (upErr) {
        setStatus({ success: false, message: `Ошибка загрузки фото: ${upErr.message}` });
        return;
      }
      const { data: urlData, error: urlErr } = await supabase
        .storage
        .from('images')
        .getPublicUrl(uploadData.path);
      if (urlErr || !urlData.publicUrl) {
        setStatus({ success: false, message: `Не удалось получить URL: ${urlErr?.message}` });
        return;
      }
      image_url = urlData.publicUrl;
    }

    // Мутация с новым полем
    mutation.mutate({ ...formData, image_url });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Добавить соревнование</h2>
      <div>
        <label>Название*</label><br/>
        <input name="title" value={formData.title} onChange={handleChange} required/>
      </div>
      <div>
        <label>Дата*</label><br/>
        <input name="date" type="date" value={formData.date} onChange={handleChange} required/>
      </div>
      <div>
        <label>Место*</label><br/>
        <input name="location" value={formData.location} onChange={handleChange} required/>
      </div>
      <div>
        <label>Описание</label><br/>
        <textarea name="description" value={formData.description} onChange={handleChange}/>
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
