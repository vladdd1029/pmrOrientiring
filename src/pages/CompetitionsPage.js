// src/pages/CompetitionsPage.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import CompetitionCard from '../components/cards/CompetitionCard';
import { fetchCompetitions } from '../services/api';

const CompetitionsPage = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompetitions()
  }, []);

  const getCompetitions = () => {
    setLoading(true);
    fetchCompetitions().then(setCompetitions).catch(console.error);
    setLoading(false);
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Все соревнования</h1>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <>
          {competitions.length === 0 ? (
            <p>Соревнований ещё нет.</p>
          ) : (
            competitions.map((comp) => (
              <CompetitionCard key={comp.id} competition={comp} onDeleted={() => getCompetitions()} />
            ))
          )}
        </>
      )}
    </div>
  );
};

export default CompetitionsPage;
