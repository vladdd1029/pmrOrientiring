// src/pages/CompetitionDetail.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCompetition, fetchDocuments } from '../services/api';
import LoadingElement from '../components/LoadingElement';
import { formatRUDate } from '../utils/formatDate';

export default function CompetitionDetail() {
  const { id } = useParams();

  const {
    data: competition,
    error: compError,
    isLoading: compLoading,
  } = useQuery({
    queryKey: ['competition', id],
    queryFn: () => fetchCompetition(id),
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: documents = [],
    error: docsError,
    isLoading: docsLoading,
  } = useQuery({
    queryKey: ['documentsByCompetition', id],
    queryFn: () => fetchDocuments().then(arr => arr.filter(d => d.competition_id === id)),
    staleTime: 1000 * 60 * 5,
  });

  if (compLoading || docsLoading) {
    return <LoadingElement />;
  }
  if (compError) {
    return <p style={{ color: 'red' }}>Ошибка при загрузке соревнования: {compError.message}</p>;
  }
  if (!competition) {
    return <p>Соревнование не найдено.</p>;
  }

  const { title, date, location, description } = competition;
  const formattedDate = formatRUDate(date);

  return (
    <div style={{ padding: 20 }}>
      <h1>{title}</h1>
      <p><strong>Дата:</strong> {formattedDate}</p>
      <p><strong>Место:</strong> {location}</p>
      {description && <div style={{ margin: '20px 0' }}><p>{description}</p></div>}

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

      <Link to="/competitions">
        <button>Вернуться к списку соревнований</button>
      </Link>
    </div>
  );
}
// src/pages/CompetitionDetail.js