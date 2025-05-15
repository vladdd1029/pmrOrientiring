// src/pages/NewsDetail.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchNewsItem, fetchDocuments } from '../services/api';
import LoadingElement from '../components/LoadingElement';
import { formatRUDate } from '../utils/formatDate';

export default function NewsDetail() {
  const { id } = useParams();

  const {
    data: news,
    error: newsError,
    isLoading: newsLoading,
  } = useQuery({
    queryKey: ['newsItem', id],
    queryFn: () => fetchNewsItem(id),
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: documents = [],
    error: docsError,
    isLoading: docsLoading,
  } = useQuery({
    queryKey: ['documentsByNews', id],
    queryFn: () => fetchDocuments().then(arr => arr.filter(d => d.news_id === id)),
    staleTime: 1000 * 60 * 5,
  });

  if (newsLoading || docsLoading) {
    return <LoadingElement />;
  }
  if (newsError) {
    return <p style={{ color: 'red' }}>Ошибка при загрузке новости: {newsError.message}</p>;
  }
  if (!news) {
    return <p>Новость не найдена.</p>;
  }

  const { title, content, created_at } = news;
  const formattedDate = formatRUDate(created_at);

  return (
    <div style={{ padding: 20 }}>
      <h1>{title}</h1>
      <p><em>Опубликовано: {formattedDate}</em></p>
      {content && <div style={{ margin: '20px 0' }}><p>{content}</p></div>}

      <h2>Документы</h2>
      {documents.length > 0 ? (
        <ul>
          {documents.map(doc => (
            <li key={doc.id}>
              <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                {doc.title}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Документов пока нет.</p>
      )}

      <Link to="/news">
        <button>Вернуться к списку новостей</button>
      </Link>
    </div>
  );
}
