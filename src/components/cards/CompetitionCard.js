// src/components/CompetitionCard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import DeleteModal from '../layout/DeleteModal';
// импортируем queryClient и функцию фетча
import { useQueryClient } from '@tanstack/react-query';
import { fetchCompetition } from '../../services/api';

export default function CompetitionCard({ competition, onDeleted }) {
  const { profile } = useUser();
  const [showDel, setShowDel] = useState(false);
  const queryClient = useQueryClient();

  return (
    <>
      <Link
        to={`/competition/${competition.id}`}
        onMouseEnter={() => {
          queryClient.prefetchQuery({
            queryKey: ['competition', competition.id],
            queryFn: () => fetchCompetition(competition.id),
            staleTime: 1000 * 60 * 5,
          });
        }}
        style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card">
          <h3>{competition.title}</h3>
          <p>Дата: {new Date(competition.date).toLocaleDateString('ru-RU')}</p>
          <p>Место: {competition.location}</p>
        </div>
      </Link>
      {profile?.role === 'admin' && (
        <button className="delete-btn" onClick={() => setShowDel(true)}>x</button>
      )}


      <DeleteModal
        itemType="competition"
        item={competition}
        isOpen={showDel}
        onClose={() => setShowDel(false)}
        onDeleted={onDeleted}
      />
    </>
  );
}
