import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchClubs } from '../services/api';
import ClubCard from '../components/cards/ClubCard';

export default function ClubsPage() {
  const { data: clubs = [], error, isLoading } = useQuery({
    queryKey: ['clubs'],
    queryFn: fetchClubs,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <p>Загрузка клубов…</p>;
  }
  if (error) {
    return <p style={{ color: 'red' }}>Ошибка: {error.message}</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Клубы</h1>
      {clubs.length === 0 ? (
        <p>Клубов пока нет.</p>
      ) : (
        clubs.map(club => (
          <ClubCard key={club.id} club={club} />
        ))
      )}
    </div>
  );
}
// src/pages/ClubsPage.js