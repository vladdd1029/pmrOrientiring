import React from 'react';
import { Link } from 'react-router-dom';

export default function MaterialCard({ material }) {
  const { id, title, category } = material;
  return (
    <Link
      to={`/materials/${id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: '10px' }}
    >
      <div className="card">
        <h3>{title}</h3>
        {category && (
          <p style={{ fontSize: '0.9em', color: '#666' }}>Категория: {category}</p>
        )}
      </div>
    </Link>
  );
}
