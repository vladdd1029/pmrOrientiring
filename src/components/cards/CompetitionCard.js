// src/components/CompetitionCard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import DeleteModal from '../layout/DeleteModal';

export default function CompetitionCard({ competition, onDeleted }) {
  const { profile } = useUser();
  const [showDel, setShowDel] = useState(false);

  return (
    <>
      <Link to={`/competition/${competition.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
