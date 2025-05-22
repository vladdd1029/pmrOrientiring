// src/pages/CompetitionDetail.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCompetition, fetchDocuments } from '../services/api';
import LoadingElement from '../components/LoadingElement';
import { formatRUDate } from '../utils/formatDate';
import '../styles/CompetitionDetail.css'; // новый CSS

export default function CompetitionDetail() {
  const { id } = useParams();

  const { data: comp, error: compErr, isLoading: compLoad } = useQuery({
    queryKey: ['competition', id],
    queryFn: () => fetchCompetition(id),
    staleTime: 1000 * 60 * 5,
  });
  const { data: docs = [], isLoading: docsLoad } = useQuery({
    queryKey: ['documentsByCompetition', id],
    queryFn: () => fetchDocuments().then(a => a.filter(d => d.competition_id === id)),
    staleTime: 1000 * 60 * 5,
  });

  if (compLoad || docsLoad) return <LoadingElement />;
  if (compErr) return <p className="error">Ошибка: {compErr.message}</p>;
  if (!comp) return <p>Соревнование не найдено.</p>;

  const { title, date, location, description, image_url } = comp;
  const formattedDate = formatRUDate(date);

  return (
    <div className="competition-detail-page">
      {/* Хедер с размытым фоном */}
      {image_url && (
        <div
          className="competition-header"
          style={{ backgroundImage: `url(${image_url})` }}
        />
      )}

      {/* Контейнер с контентом */}
      <div className="competition-content">
        <h1 className="comp-title">{title}</h1>
        <p className="comp-meta">
          <strong>Дата:</strong> {formattedDate} &nbsp;|&nbsp;
          <strong>Место:</strong> {location}
        </p>
        {description && <p className="comp-desc">{description}</p>}

        <h2>Документы</h2>
        {docs.length ? (
          <ul className="comp-docs-list">
            {docs.map(d => (
              <li key={d.id}>
                <a href={d.file_url} target="_blank" rel="noopener noreferrer">
                  {d.title}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>Документов пока нет.</p>
        )}

        <Link to="/competitions">
          <button className="back-button">← Вернуться к списку</button>
        </Link>
      </div>
    </div>
  );
}
