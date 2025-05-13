import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AddDocumentForm = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [competitionId, setCompetitionId] = useState('');
  const [file, setFile] = useState(null);
  const [competitions, setCompetitions] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    supabase
      .from('competitions')
      .select('id, title')
      .order('date', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error(error.message);
        else setCompetitions(data);
      });
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!title || !file || !competitionId) {
      setStatus({ success: false, message: 'Заполните все поля.' });
      return;
    }

    // 1) Загружаем файл в Storage (bucket "documents")
    const filePath = `documents/${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('documents')
      .upload(filePath, file);
    if (uploadError) {
      setStatus({ success: false, message: uploadError.message });
      return;
    }

    // 2) Получаем публичный URL
    const { publicURL, error: urlError } = supabase
      .storage
      .from('documents')
      .getPublicUrl(uploadData.path);
    if (urlError) {
      setStatus({ success: false, message: urlError.message });
      return;
    }

    // 3) Сохраняем запись в таблице
    const { error } = await supabase
      .from('documents')
      .insert([{ title, file_url: publicURL, competition_id: competitionId }]);
    if (error) {
      setStatus({ success: false, message: error.message });
    } else {
      setStatus({ success: true, message: 'Документ добавлен!' });
      setTitle(''); setFile(null); setCompetitionId('');
      if (onSuccess) onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Добавить документ</h2>
      <div>
        <label>Название*</label><br/>
        <input value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Соревнование*</label><br/>
        <select value={competitionId} onChange={e => setCompetitionId(e.target.value)} required>
          <option value="">— Выберите соревнование —</option>
          {competitions.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Файл (PDF, изображение…)*</label><br/>
        <input type="file" accept="application/pdf,image/*" onChange={handleFileChange} required />
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
