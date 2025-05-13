// src/components/forms/AddMaterialForm.js
import React, { useState } from 'react';
// клиент для Storage
import { supabase } from '../../services/supabaseClient';
// централизованная функция вставки в таблицу
import { addMaterial } from '../../services/api';

export default function AddMaterialForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const { title, description, category } = formData;
    if (!title) {
      setStatus({ success: false, message: 'Введите название.' });
      return;
    }

    let fileUrl = null;
    if (file) {
      // загрузка в Storage
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('materials')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (uploadError) {
        setStatus({ success: false, message: uploadError.message });
        return;
      }
      // получение публичного URL
      const { data: urlData, error: urlError } = await supabase
        .storage
        .from('materials')
        .getPublicUrl(uploadData.path);
      const publicURL = urlData?.publicUrl ?? urlData?.publicURL;
      if (urlError || !publicURL) {
        setStatus({ success: false, message: urlError?.message || 'Не удалось получить URL файла.' });
        return;
      }
      fileUrl = publicURL;
    }

    try {
      // вставка через api.js
      await addMaterial({ title, description, category, file_url: fileUrl });
      setStatus({ success: true, message: 'Материал добавлен!' });
      setFormData({ title: '', description: '', category: '' });
      setFile(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      setStatus({ success: false, message: error.message });
    }
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
      <button type="submit">Сохранить</button>
      {status && (
        <div style={{ color: status.success ? 'green' : 'red', marginTop: 10 }}>
          {status.message}
        </div>
      )}
    </form>
  );
};

