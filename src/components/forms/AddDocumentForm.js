import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCompetitions, fetchNews, addDocument } from '../../services/api';
import { supabase } from '../../services/supabaseClient';

export default function AddDocumentForm({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [linkType, setLinkType] = useState('none');
  const [competitionId, setCompetitionId] = useState('');
  const [newsId, setNewsId] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const queryClient = useQueryClient();

  const { data: competitions = [] } = useQuery({
    queryKey: ['competitionsList'],
    queryFn: fetchCompetitions,
    staleTime: 1000 * 60 * 5
  });
  const { data: newsList = [] } = useQuery({
    queryKey: ['newsList'],
    queryFn: fetchNews,
    staleTime: 1000 * 60 * 5
  });

  const mutation = useMutation({
    mutationFn: addDocument,
    onError: err => setStatus({ success: false, message: err.message }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
    onSuccess: () => {
      setStatus({ success: true, message: 'Документ добавлен!' });
      setTitle(''); setLinkType('none'); setCompetitionId(''); setNewsId(''); setFile(null);
      if (onSuccess) onSuccess();
    }
  });

  const handleFileChange = e => setFile(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(null);
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

    // загрузка в Storage
    const fileName = `${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage.from('documents').upload(fileName, file, { cacheControl: '3600' });
    if (uploadError) {
      setStatus({ success: false, message: uploadError.message });
      return;
    }
    const { data: urlData, error: urlError } = await supabase
      .storage.from('documents').getPublicUrl(uploadData.path);
    const publicURL = urlData?.publicUrl ?? urlData?.publicURL;
    if (urlError || !publicURL) {
      setStatus({ success: false, message: urlError?.message || 'Не удалось получить URL.' });
      return;
    }

    // отправляем в БД
    mutation.mutate({
      title,
      file_url: publicURL,
      competition_id: linkType === 'competition' ? competitionId : null,
      news_id: linkType === 'news' ? newsId : null,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Добавить документ</h2>
      <div>
        <label>Название*</label><br />
        <input value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Привязать к</label><br />
        <select value={linkType} onChange={e => setLinkType(e.target.value)}>
          <option value="none">— Не привязывать —</option>
          <option value="competition">Соревнованию</option>
          <option value="news">Новости</option>
        </select>
      </div>
      {linkType === 'competition' && (
        <div>
          <label>Соревнование*</label><br />
          <select value={competitionId} onChange={e => setCompetitionId(e.target.value)} required>
            <option value="">— Выберите —</option>
            {competitions.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
      )}
      {linkType === 'news' && (
        <div>
          <label>Новость*</label><br />
          <select value={newsId} onChange={e => setNewsId(e.target.value)} required>
            <option value="">— Выберите —</option>
            {newsList.map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
          </select>
        </div>
      )}
      <div>
        <label>Файл*</label><br />
        <input type="file" accept="application/pdf,image/*" onChange={handleFileChange} required />
      </div>
      <button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? 'Загружаем…' : 'Загрузить'}
      </button>
      {status && (
        <div style={{ color: status.success ? 'green' : 'red', marginTop: 10 }}>
          {status.message}
        </div>
      )}
    </form>
  );
}
