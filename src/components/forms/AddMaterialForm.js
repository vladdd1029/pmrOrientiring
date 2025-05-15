import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addMaterial } from '../../services/api';
import { supabase } from '../../services/supabaseClient';

export default function AddMaterialForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addMaterial,
    onError: err => setStatus({ success: false, message: err.message }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['materials'] }),
    onSuccess: () => {
      setStatus({ success: true, message: 'Материал добавлен!' });
      setFormData({ title: '', description: '', category: '' });
      setFile(null);
      if (onSuccess) onSuccess();
    }
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleFileChange = e => setFile(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(null);
    if (!formData.title) {
      setStatus({ success: false, message: 'Введите название.' });
      return;
    }

    let fileUrl = null;
    if (file) {
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage.from('materials').upload(fileName, file, { cacheControl: '3600' });
      if (uploadError) {
        setStatus({ success: false, message: uploadError.message });
        return;
      }
      const { data: urlData, error: urlError } = await supabase
        .storage.from('materials').getPublicUrl(uploadData.path);
      fileUrl = urlData?.publicUrl ?? urlData?.publicURL;
      if (urlError || !fileUrl) {
        setStatus({ success: false, message: urlError?.message || 'Не удалось получить URL.' });
        return;
      }
    }

    mutation.mutate({ ...formData, file_url: fileUrl });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Добавить учебный материал</h2>
      <div>
        <label>Название*</label><br />
        <input name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <label>Описание</label><br />
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </div>
      <div>
        <label>Категория</label><br />
        <input name="category" value={formData.category} onChange={handleChange} />
      </div>
      <div>
        <label>Файл (опционально)</label><br />
        <input type="file" onChange={handleFileChange} />
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
