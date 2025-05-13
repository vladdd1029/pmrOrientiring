import React from 'react';
import { Link } from 'react-router-dom';

export default function ClubCard({ club }) {
  const { id, name, region } = club;
  return (
    <Link
      to={`/clubs/${id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: '10px' }}
    >
      <div className="card">
        <h3>{name}</h3>
        {region && <p style={{ fontSize: '0.9em', color: '#666' }}>Регион: {region}</p>}
      </div>
    </Link>
  );
}
