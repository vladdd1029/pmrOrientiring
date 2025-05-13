import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function MaterialDetail() {
  const { id } = useParams();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('materials')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) console.error(error.message);
        else setMaterial(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (!material) return <p>Материал не найден.</p>;

  const { title, description, category, file_url } = material;
  return (
    <div style={{ padding: '20px' }}>
      <h1>{title}</h1>
      {category && <p><strong>Категория:</strong> {category}</p>}
      {description && (
        <div style={{ margin: '20px 0' }}>
          <p>{description}</p>
        </div>
      )}
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
