import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNews } from '../services/api';
import NewsCard from '../components/cards/NewsCard';

export default function NewsPage() {
  const { data: newsList = [], error, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <p>Загрузка новостей…</p>;
  }
  if (error) {
    return <p style={{ color: 'red' }}>Ошибка: {error.message}</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Новости</h1>
      {newsList.length === 0 ? (
        <p>Новостей пока нет.</p>
      ) : (
        newsList.map(item => (
          <NewsCard key={item.id} news={item} />
        ))
      )}
    </div>
  );
}
// src/pages/NewsPage.js