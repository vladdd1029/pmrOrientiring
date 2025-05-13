import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import CompetitionCard from '../components/CompetitionCard';

const CompetitionsPage = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Ошибка при загрузке всех соревнований:', error.message);
      } else {
        setCompetitions(data);
      }
      setLoading(false);
    };

    fetchAll();
  }, []);

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
              <CompetitionCard key={comp.id} competition={comp} />
            ))
          )}
        </>
      )}
    </div>
  );
};

export default CompetitionsPage;
