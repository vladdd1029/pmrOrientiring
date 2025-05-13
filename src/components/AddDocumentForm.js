// src/components/AddDocumentForm.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AddDocumentForm = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [linkType, setLinkType] = useState('none'); // 'none' | 'competition' | 'news'
  const [competitionId, setCompetitionId] = useState('');
  const [newsId, setNewsId] = useState('');
  const [file, setFile] = useState(null);
  const [competitions, setCompetitions] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [status, setStatus] = useState(null);

  // Загружаем списки соревнований и новостей
  useEffect(() => {
    async function fetchOptions() {
      const { data: comps } = await supabase
        .from('competitions')
        .select('id, title')
        .order('date', { ascending: true });
      setCompetitions(comps || []);

      const { data: newsData } = await supabase
        .from('news')
        .select('id, title')
        .order('created_at', { ascending: false });
      setNewsList(newsData || []);
    }
    fetchOptions();
  }, []);

  const handleFileChange = e => setFile(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(null);

    // Валидация
    if (!title || !file) {
      setStatus({ success: false, message: 'Заполните название и выберите файл.' });
      return;
    }
    if (linkType === 'competition' && !competitionId) {
      setStatus({ success: false, message: 'Выберите соревнование.' });
      return;
    }
    if (linkType === 'news' && !newsId) {
      setStatus({ success: false, message: 'Выберите новость.' });
      return;
    }

    // Генерация имени файла (без вложенной папки)
    const fileName = `${Date.now()}_${file.name}`;

    // 1) Загружаем файл
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('documents')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    console.log('⚙️ uploadData:', uploadData);
    console.log('⚠️ uploadError:', uploadError);

    if (uploadError) {
      setStatus({ success: false, message: uploadError.message });
      return;
    }

    // 2) Получаем public URL по пути из uploadData
    const { data: urlData, error: urlError } = await supabase
      .storage
      .from('documents')
      .getPublicUrl(uploadData.path);

    // В зависимости от версии клиента URL может быть в urlData.publicUrl или urlData.publicURL
    const publicURL = urlData?.publicUrl ?? urlData?.publicURL;

    if (urlError || !publicURL) {
      setStatus({
        success: false,
        message: urlError?.message || 'Не удалось получить публичный URL файла.'
      });
      return;
    }

    // 3) Вставляем запись в таблицу
    const insertObj = {
      title,
      file_url: publicURL,
      competition_id: linkType === 'competition' ? competitionId : null,
      news_id: linkType === 'news' ? newsId : null
    };
    const { error: insertError } = await supabase
      .from('documents')
      .insert([insertObj]);

    if (insertError) {
      setStatus({ success: false, message: insertError.message });
    } else {
      setStatus({ success: true, message: 'Документ добавлен!' });
      // Сброс полей
      setTitle('');
      setFile(null);
      setLinkType('none');
      setCompetitionId('');
      setNewsId('');
      if (onSuccess) onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Добавить документ</h2>

      <div>
        <label>Название*</label><br />
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Привязать к</label><br />
        <select
          value={linkType}
          onChange={e => setLinkType(e.target.value)}
        >
          <option value="none">— Не привязывать —</option>
          <option value="competition">Соревнование</option>
          <option value="news">Новость</option>
        </select>
      </div>

      {linkType === 'competition' && (
        <div>
          <label>Соревнование*</label><br />
          <select
            value={competitionId}
            onChange={e => setCompetitionId(e.target.value)}
            required
          >
            <option value="">— Выберите —</option>
            {competitions.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      )}

      {linkType === 'news' && (
        <div>
          <label>Новость*</label><br />
          <select
            value={newsId}
            onChange={e => setNewsId(e.target.value)}
            required
          >
            <option value="">— Выберите —</option>
            {newsList.map(n => (
              <option key={n.id} value={n.id}>{n.title}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label>Файл*</label><br />
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
          required
        />
      </div>

      <button type="submit">Загрузить</button>

      {status && (
        <div style={{ color: status.success ? 'green' : 'red', marginTop: 10 }}>
          {status.message}
        </div>
      )}
    </form>
  );
};

export default AddDocumentForm;
