import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNews } from '../services/api';
import NewsCard from '../components/cards/NewsCard';
import '../styles/CardsPage.css';
import '../styles/cards-grid.css';

export default function NewsPage() {
  const { data: newsList = [], error, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <p className='loading-text'>Загрузка новостей…</p>;
  }
  if (error) {
    return <p className='error-text'>Ошибка: {error.message}</p>;
  }

  return (
    <div className="page">
      <h1>Новости</h1>

      {newsList.length === 0 && <p>Новостей пока нет.</p>}

      {newsList.length > 0 && (
        <div className="cards-grid">
          {newsList.map(item => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      )}
    </div>
  );
}
// src/pages/NewsPage.js