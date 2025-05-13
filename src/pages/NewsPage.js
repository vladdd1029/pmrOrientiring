// src/pages/NewsPage.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import NewsCard from '../components/cards/NewsCard';
import { fetchNews } from '../services/api';

const NewsPage = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNews()
  }, []);

  const getNews = () => {
    setLoading(true);
    fetchNews().then(setNewsList).catch(console.error);
    setLoading(false);
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Новости</h1>
      {loading
        ? <p>Загрузка...</p>
        : (
          newsList.length === 0
            ? <p>Новостей пока нет.</p>
            : newsList.map(n => (
              <NewsCard key={n.id} news={n} onDeleted={() => getNews()} />
            ))
        )
      }
    </div>
  );
};

export default NewsPage;
