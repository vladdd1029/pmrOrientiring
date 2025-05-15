import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Link } from 'react-router-dom';
import { fetchMaterial } from '../../services/api';

export default function MaterialCard({ material }) {
  const queryClient = useQueryClient();
  const { id, title, category } = material;

  return (
    <Link
      to={`/materials/${id}`}
      onMouseEnter={() => {
        queryClient.prefetchQuery({
          queryKey: ['materials', id],
          queryFn: () => fetchMaterial(id),
          staleTime: 1000 * 60 * 5,
        });
      }}
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
