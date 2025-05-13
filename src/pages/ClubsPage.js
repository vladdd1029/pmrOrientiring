import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ClubCard from '../components/ClubCard';

export default function ClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('clubs')
      .select('*')
      .order('name', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error(error.message);
        else setClubs(data);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Клубы</h1>
      {loading
        ? <p>Загрузка...</p>
        : clubs.length === 0
          ? <p>Клубов пока нет.</p>
          : clubs.map(c => <ClubCard key={c.id} club={c} />)
      }
    </div>
  );
}
