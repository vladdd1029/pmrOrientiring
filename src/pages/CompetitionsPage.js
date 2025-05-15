// src/pages/CompetitionsPage.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCompetitions } from '../services/api';
import CompetitionCard from '../components/cards/CompetitionCard';

export default function CompetitionsPage() {
  const { data: competitions, error, isLoading } = useQuery({
    queryKey: ['competitions'],
    queryFn: fetchCompetitions,
    staleTime: 1000 * 60 * 5, // кеш 5 минут
  });

  if (isLoading) {
    return (
      <div style={{ padding: '20px' }}>
        <p>Загрузка соревнований…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <p style={{ color: 'red' }}>
          Ошибка при загрузке соревнований: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Все соревнования</h1>
      {competitions.length === 0 ? (
        <p>Соревнований ещё нет.</p>
      ) : (
        competitions.map(comp => (
          <CompetitionCard key={comp.id} competition={comp} />
        ))
      )}
    </div>
  );
}
