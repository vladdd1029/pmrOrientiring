// src/components/CompetitionCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const CompetitionCard = ({ competition }) => {
  const { id, title, date, location } = competition;

  const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Link
      to={`/competition/${id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        marginBottom: '10px'
      }}
    >
      <div style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '12px',
        transition: 'box-shadow .2s',
      }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <h3>{title}</h3>
        <p><strong>Дата:</strong> {formattedDate}</p>
        <p><strong>Место:</strong> {location}</p>
      </div>
    </Link>
  );
};

export default CompetitionCard;
