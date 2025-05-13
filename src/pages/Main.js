import React, { useEffect, useState } from 'react';
import CompetitionCard from '../components/cards/CompetitionCard';
import { Link } from 'react-router-dom';
import { fetchCompetitions } from '../services/api';

const Main = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCompetitions()
      .then(data => setCompetitions(data.slice(0, 6)))
      .catch(err => console.error(err.message));
    setLoading(false);
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
