// src/pages/ClubDetail.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchClub } from '../services/api';
import LoadingElement from '../components/LoadingElement';

export default function ClubDetail() {
  const { id } = useParams();

  const { data: club, error, isLoading } = useQuery({
    queryKey: ['club', id],
    queryFn: () => fetchClub(id),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <LoadingElement />;
  }
  if (error) {
    return <p style={{ color: 'red' }}>Ошибка при загрузке клуба: {error.message}</p>;
  }
  if (!club) {
    return <p>Клуб не найден.</p>;
  }

  const { name, region, description, contacts } = club;

  return (
    <div style={{ padding: 20 }}>
      <h1>{name}</h1>
      {region && <p><strong>Регион:</strong> {region}</p>}
      {description && <div style={{ margin: '20px 0' }}><p>{description}</p></div>}
      {contacts && <p><strong>Контакты:</strong> {contacts}</p>}

      <Link to="/clubs">
        <button>Вернуться к списку клубов</button>
      </Link>
    </div>
  );
}
// src/pages/ClubDetail.js