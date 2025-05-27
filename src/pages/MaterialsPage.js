import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMaterials } from '../services/api';
import MaterialCard from '../components/cards/MaterialCard';
import '../styles/CardsPage.css';
import '../styles/cards-grid.css';

export default function MaterialsPage() {
  const { data: materials = [], error, isLoading } = useQuery({
    queryKey: ['materials'],
    queryFn: fetchMaterials,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <p className='loading-text'>Загрузка материалов…</p>;
  }
  if (error) {
    return <p className='error-text'>Ошибка: {error.message}</p>;
  }

  return (
    <div className='page'>
      <h1>Учебные материалы</h1>
      {materials.length === 0 ? (
        <p>Материалов пока нет.</p>
      ) : (
        <div className='cards-grid'>
          {materials.map(mat => (
            <MaterialCard key={mat.id} material={mat} />
          ))}
        </div>
      )}
    </div>
  );
}
// src/pages/MaterialsPage.js