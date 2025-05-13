import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function ClubDetail() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('clubs')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) console.error(error.message);
        else setClub(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (!club) return <p>Клуб не найден.</p>;

  const { name, description, region, contacts } = club;
  return (
    <div style={{ padding: '20px' }}>
      <h1>{name}</h1>
      {region && <p><strong>Регион:</strong> {region}</p>}
      {description && <div style={{ margin: '20px 0' }}><p>{description}</p></div>}
      {contacts && (
        <p><strong>Контакты:</strong> {contacts}</p>
      )}
      <Link to="/clubs">
        <button>Вернуться к списку клубов</button>
      </Link>
    </div>
  );
}
