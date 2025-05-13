// src/pages/NewsDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();
      if (error) console.error('Ошибка загрузки новости:', error.message);
      else setNews(data);
      setLoading(false);
    };
    fetchNews();
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (!news) return <p>Новость не найдена.</p>;

  const { title, content, created_at, competition_id } = news;
  const date = new Date(created_at).toLocaleDateString('ru-RU', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1>{title}</h1>
      <p style={{ fontSize: '0.9em', color: '#666' }}>{date}</p>
      <div style={{ margin: '20px 0' }}>
        {content}
      </div>
      {competition_id && (
        <p>
          <Link to={`/competition/${competition_id}`}>
            Перейти к соревнованию
          </Link>
        </p>
      )}
      <Link to="/news">
        <button>Вернуться к новостям</button>
      </Link>
    </div>
  );
};

export default NewsDetail;
