// src/pages/NewsPage.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import NewsCard from '../components/NewsCard';

const NewsPage = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) console.error('Ошибка загрузки новостей:', error.message);
      else setNewsList(data);
      setLoading(false);
    };
    loadNews();
  }, []);

  const reload = () => {
    const loadNews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) console.error('Ошибка загрузки новостей:', error.message);
      else setNewsList(data);
      setLoading(false);
    };
    loadNews();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Новости</h1>
      {loading
        ? <p>Загрузка...</p>
        : (
          newsList.length === 0
            ? <p>Новостей пока нет.</p>
            : newsList.map(n => (
              <NewsCard key={n.id} news={n} onDeleted={() => reload()} />
            ))
        )
      }
    </div>
  );
};

export default NewsPage;
