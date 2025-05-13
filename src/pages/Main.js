// File: src/pages/Main.js
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import CompetitionCard from '../components/CompetitionCard';
import { Link } from 'react-router-dom';

const Main = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompetitions = async () => {
      setLoading(true);

      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .order('date', { ascending: true }) // сортируем по дате
        .limit(8); // первые 8

      if (error) {
        console.error('Ошибка при загрузке соревнований:', error.message);
      } else {
        setCompetitions(data);
      }

      setLoading(false);
    };

    loadCompetitions();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Ближайшие или прошедшие соревнования</h2>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <>
          {competitions.length === 0 ? (
            <p>Нет данных о соревнованиях.</p>
          ) : (
            competitions.map((comp) => (
              <CompetitionCard key={comp.id} competition={comp} />
            ))
          )}

          <Link to="/competitions" style={{ display: 'inline-block', marginTop: '15px' }}>
            <button>Смотреть все соревнования</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Main;
