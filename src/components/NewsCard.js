// src/components/NewsCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const NewsCard = ({ news }) => {
  const { id, title, content, created_at, competition_id } = news;
  const snippet = content
    ? (content.length > 100 ? content.slice(0, 100) + '…' : content)
    : '';

  const formattedDate = new Date(created_at).toLocaleDateString('ru-RU', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <Link
      to={`/news/${id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: '10px' }}
    >
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '12px',
          transition: 'box-shadow .2s',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <h3 style={{ margin: '0 0 8px' }}>{title}</h3>
        <p style={{ fontSize: '0.9em', color: '#666', margin: '0 0 12px' }}>
          {formattedDate}
        </p>
        <p style={{ margin: '0 0 12px' }}>{snippet}</p>
        {competition_id && (
          <p style={{ margin: 0, fontSize: '0.9em' }}>
            <Link
              to={`/competition/${competition_id}`}
              style={{ textDecoration: 'underline', color: '#007bff' }}
              onClick={e => e.stopPropagation()}
            >
              Подробнее о соревновании
            </Link>
          </p>
        )}
      </div>
    </Link>
  );
};

export default NewsCard;
