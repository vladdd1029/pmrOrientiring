import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCompetitions } from '../services/api';
import CompetitionCard from '../components/cards/CompetitionCard';
import { Link } from 'react-router-dom';
import '../styles/CardsPage.css';
import '../styles/cards-grid.css';

export default function Main() {
  const { data: competitions = [], error, isLoading } = useQuery({
    queryKey: ['competitionsMain'],
    queryFn: fetchCompetitions,
    staleTime: 1000 * 60 * 5, // 5 минут
  });

  if (isLoading) {
    return <p className='loading-text'>Загрузка ближайших соревнований…</p>;
  }
  if (error) {
    return <p className='error-text'>Ошибка: {error.message}</p>;
  }

  const list = competitions.slice(0, 8);

  return (
    <div className='page' style={{ padding: '20px' }}>
      <h2>Ближайшие или прошедшие соревнования</h2>
      {list.length === 0 ? (
        <h2>Нет данных о соревнованиях.</h2>
      ) : (
        <div className="cards-grid">
          {list.map(c => (
            <CompetitionCard key={c.id} competition={c} />
          ))}
        </div>
      )}
      <Link to="/competitions">
        <button style={{ marginTop: 15 }}>Смотреть все соревнования</button>
      </Link>
    </div>
  );
}
