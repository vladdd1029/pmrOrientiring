// src/pages/MaterialDetail.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMaterial } from '../services/api';
import LoadingElement from '../components/LoadingElement';

export default function MaterialDetail() {
  const { id } = useParams();

  const { data: material, error, isLoading } = useQuery({
    queryKey: ['material', id],
    queryFn: () => fetchMaterial(id),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <LoadingElement />;
  }
  if (error) {
    return <p style={{ color: 'red' }}>Ошибка при загрузке материала: {error.message}</p>;
  }
  if (!material) {
    return <p>Материал не найден.</p>;
  }

  const { title, description, category, file_url } = material;

  return (
    <div style={{ padding: 20 }}>
      <h1>{title}</h1>
      {category && <p><strong>Категория:</strong> {category}</p>}
      {description && <div style={{ margin: '20px 0' }}><p>{description}</p></div>}
      {file_url && (
        <p>
          <a href={file_url} target="_blank" rel="noopener noreferrer">
            Скачать файл
          </a>
        </p>
      )}
      <Link to="/materials">
        <button>Вернуться к материалам</button>
      </Link>
    </div>
  );
}
// src/pages/MaterialDetail.js