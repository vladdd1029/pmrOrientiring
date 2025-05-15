import React from 'react';
import { Link } from 'react-router-dom';
import { fetchClub } from '../../services/api';
import { useQueryClient } from '@tanstack/react-query';

export default function ClubCard({ club }) {
  const queryClient = useQueryClient();

  const { id, name, region } = club;
  return (
    <Link
      to={`/clubs/${id}`}
      onMouseEnter={() => {
        queryClient.prefetchQuery({
          queryKey: ['clubs', id],
          queryFn: () => fetchClub(id),
          staleTime: 1000 * 60 * 5,
        });
      }}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: '10px' }}
    >
      <div className="card">
        <h3>{name}</h3>
        {region && <p style={{ fontSize: '0.9em', color: '#666' }}>Регион: {region}</p>}
      </div>
    </Link>
  );
}
