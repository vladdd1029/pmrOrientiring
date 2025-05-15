import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMaterials } from '../services/api';
import MaterialCard from '../components/cards/MaterialCard';

export default function MaterialsPage() {
  const { data: materials = [], error, isLoading } = useQuery({
    queryKey: ['materials'],
    queryFn: fetchMaterials,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <p>Загрузка материалов…</p>;
  }
  if (error) {
    return <p style={{ color: 'red' }}>Ошибка: {error.message}</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Учебные материалы</h1>
      {materials.length === 0 ? (
        <p>Материалов пока нет.</p>
      ) : (
        materials.map(mat => (
          <MaterialCard key={mat.id} material={mat} />
        ))
      )}
    </div>
  );
}
// src/pages/MaterialsPage.js