import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCompetition, fetchDocuments } from '../services/api';

const CompetitionDetail = () => {
  const { id } = useParams();
  const [competition, setCompetition] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // 1. Загрузка самого соревнования
      const comp = await fetchCompetition(id)
        .catch(err => console.error(err.message));
      setCompetition(comp);

      // 2. Загрузка документов, привязанных к соревнованию
      const docs = await fetchDocuments()
        .then(arr => arr.filter(d => d.competition_id === id))
        .catch(err => console.error(err.message));
      setDocuments(docs);

      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (!competition) return <p>Соревнование не найдено.</p>;

  const { title, date, location, description } = competition;
  const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1>{title}</h1>
      <p><strong>Дата:</strong> {formattedDate}</p>
      <p><strong>Место:</strong> {location}</p>
      {description && (
        <div style={{ margin: '20px 0' }}>
          <p>{description}</p>
        </div>
      )}

      {documents.length > 0 ? (
        <div>
          <h2>Документы</h2>
          <ul>
            {documents.map(doc => (
              <li key={doc.id}>
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {doc.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : <h2>Документов пока нет</h2>}

      <Link to="/competitions">
        <button>Вернуться к списку соревнований</button>
      </Link>
    </div>
  );
};

export default CompetitionDetail;
