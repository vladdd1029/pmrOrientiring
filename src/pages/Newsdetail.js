import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchNewsItem, fetchDocuments } from '../services/api';
import LoadingElement from '../components/LoadingElement';
import { formatRUDate } from '../utils/formatDate';
import '../styles/NewsDetail.css';

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
    isLoading: docsLoading,
  } = useQuery({
    queryKey: ['documentsByNews', id],
    queryFn: () =>
      fetchDocuments().then(arr => arr.filter(d => d.news_id === id)),
    staleTime: 1000 * 60 * 5,
  });

  if (newsLoading || docsLoading) return <LoadingElement />;
  if (newsError) return <p className="error">Ошибка: {newsError.message}</p>;
  if (!news) return <p>Новость не найдена.</p>;

  const { title, content, created_at, image_url } = news;
  const formattedDate = formatRUDate(created_at);

  return (
    <div className="news-detail-page">
      {/* Размытый фон */}
      {image_url && (
        <div
          className="news-header"
          style={{ backgroundImage: `url(${image_url})` }}
        />
      )}

      <div className="news-content">
        <h1 className="news-title">{title}</h1>
        <p className="news-meta">Опубликовано: {formattedDate}</p>
        {content && <p className="news-desc">{content}</p>}

        <h2>Документы</h2>
        {documents.length > 0 ? (
          <ul className="news-docs-list">
            {documents.map(d => (
              <li key={d.id}>
                <a
                  href={d.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {d.title}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>Документов пока нет.</p>
        )}

        <Link to="/news">
          <button className="back-button">← Вернуться к новостям</button>
        </Link>
      </div>
    </div>
  );
}
