// src/pages/CompetitionsPage.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCompetitions } from '../services/api';
import CompetitionCard from '../components/cards/CompetitionCard';
import '../styles/CardsPage.css';
import '../styles/cards-grid.css';


export default function CompetitionsPage() {
  const { data: competitions, error, isLoading } = useQuery({
    queryKey: ['competitions'],
    queryFn: fetchCompetitions,
    staleTime: 1000 * 60 * 5, // кеш 5 минут
  });

  if (isLoading) {
    return (
      <div style={{ padding: '20px' }}>
        <p className='loading-text'>Загрузка соревнований…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <p className='error-text'>
          Ошибка при загрузке соревнований: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Все соревнования</h1>
      {competitions.length === 0 && <p>Соревнований ещё нет.</p>}
      {competitions.length > 0 && (
        <div className="cards-grid">
          {competitions.map(c => (
            <CompetitionCard key={c.id} competition={c} />
          ))}
        </div>
      )}
    </div>
  );
}
