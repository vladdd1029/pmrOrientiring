import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import ClubCard from '../components/cards/ClubCard';
import { fetchClubs } from '../services/api';

export default function ClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClubs()
  }, []);

  const getClubs = () => {
    setLoading(true);
    fetchClubs().then(setClubs).catch(console.error);
    setLoading(false);
  }

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
