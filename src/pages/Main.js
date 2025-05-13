import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import CompetitionCard from '../components/CompetitionCard';
import { Link } from 'react-router-dom';

const Main = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompetitions = async () => {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      // Сначала — предстоящие события
      let { data: upcoming, error: upErr } = await supabase
        .from('competitions')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(8);

      if (upErr) console.error(upErr.message);

      // Если будущих меньше 8, дозаполняем из прошедших
      if (upcoming.length < 8) {
        const remaining = 8 - upcoming.length;
        let { data: past, error: pastErr } = await supabase
          .from('competitions')
          .select('*')
          .lt('date', today)
          .order('date', { ascending: false })
          .limit(remaining);

        if (pastErr) console.error(pastErr.message);
        // переворачиваем прошлые на хронологический порядок
        upcoming = [...upcoming, ...past.reverse()];
      }

      setCompetitions(upcoming);
      setLoading(false);
    };

    loadCompetitions();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Ближайшие соревнования</h2>

      {loading
        ? <p>Загрузка...</p>
        : (
          <>
            {competitions.length === 0
              ? <p>Соревнований пока нет.</p>
              : competitions.map(comp =>
                  <CompetitionCard key={comp.id} competition={comp} />
                )
            }
            <Link to="/competitions" style={{ marginTop: '15px', display: 'inline-block' }}>
              <button>Смотреть все соревнования</button>
            </Link>
          </>
        )
      }
    </div>
  );
};

export default Main;
