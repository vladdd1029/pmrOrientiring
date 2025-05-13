// src/pages/NewsDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { fetchDocuments,  fetchNewsItem } from '../services/api';


const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // 1. Загрузка самого соревнования
      const newEl = await fetchNewsItem(id)
        .catch(err => console.error(err.message));
      setNews(newEl);

      // 2. Загрузка документов, привязанных к соревнованию
      const docs = await fetchDocuments()
        .then(arr => arr.filter(d => d.news_id === id))
        .catch(err => console.error(err.message));
      setDocuments(docs);

      setLoading(false);
    };

    fetchData()
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (!news) return <p>Новость не найдена.</p>;

  const { title, content, created_at, competition_id } = news;
  const date = new Date(created_at).toLocaleDateString('ru-RU', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1>{title}</h1>
      <p style={{ fontSize: '0.9em', color: '#666' }}>{date}</p>
      <div style={{ margin: '20px 0' }}>
        {content}
      </div>
      {competition_id && (
        <p>
          <Link to={`/competition/${competition_id}`}>
            Перейти к соревнованию
          </Link>
        </p>
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

      <Link to="/news">
        <button>Вернуться к новостям</button>
      </Link>
    </div>
  );
};

export default NewsDetail;
