import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCompetitions } from '../services/api';
import CompetitionCard from '../components/cards/CompetitionCard';
import { Link } from 'react-router-dom';

export default function Main() {
  const { data: competitions = [], error, isLoading } = useQuery({
    queryKey: ['competitionsMain'],
    queryFn: fetchCompetitions,
    staleTime: 1000 * 60 * 5, // 5 минут
  });

  if (isLoading) {
    return <p>Загрузка ближайших соревнований…</p>;
  }
  if (error) {
    return <p style={{ color: 'red' }}>Ошибка: {error.message}</p>;
  }

  const list = competitions.slice(0, 8);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Ближайшие или прошедшие соревнования</h2>
      {list.length === 0 ? (
        <p>Нет данных о соревнованиях.</p>
      ) : (
        list.map(comp => (
          <CompetitionCard key={comp.id} competition={comp} />
        ))
      )}
      <Link to="/competitions">
        <button style={{ marginTop: 15 }}>Смотреть все соревнования</button>
      </Link>
    </div>
  );
}
