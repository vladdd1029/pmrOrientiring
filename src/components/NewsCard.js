// src/components/NewsCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const NewsCard = ({ news }) => {
  const { id, title, content, created_at, competition_id } = news;
  const snippet = content ? content.slice(0, 100) + '…' : '';

  const date = new Date(created_at).toLocaleDateString('ru-RU', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '10px'
    }}>
      <h3><Link to={`/news/${id}`}>{title}</Link></h3>
      <p style={{ fontSize: '0.9em', color: '#666' }}>{date}</p>
      <p>{snippet}</p>
      {competition_id && (
        <p>
          <Link to={`/competition/${competition_id}`}>
            Подробнее о соревновании
          </Link>
        </p>
      )}
    </div>
  );
};

export default NewsCard;
