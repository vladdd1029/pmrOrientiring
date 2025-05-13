import React from 'react';
import { Link } from 'react-router-dom';

const DocumentCard = ({ document }) => {
  const { title, file_url, competition_id, news_id, uploaded_at } = document;
  const date = new Date(uploaded_at).toLocaleDateString('ru-RU');

  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '10px',
        transition: 'box-shadow .2s',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <a href={file_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3 style={{ margin: '0 0 8px' }}>{title}</h3>
      </a>
      <p style={{ margin: '0 0 4px', fontSize: '0.9em', color: '#666' }}>Загрузка: {date}</p>
      {competition_id && (
        <p style={{ margin: 0, fontSize: '0.9em' }}>
          <Link to={`/competition/${competition_id}`}>Перейти к соревнованию</Link>
        </p>
      )}
      {news_id && (
        <p style={{ margin: 0, fontSize: '0.9em' }}>
          <Link to={`/news/${news_id}`}>Перейти к новости</Link>
        </p>
      )}
    </div>
  );
};

export default DocumentCard;
