import React from 'react';

const DocumentCard = ({ document }) => {
  const { title, file_url, competition_id, uploaded_at } = document;
  const date = new Date(uploaded_at).toLocaleDateString('ru-RU', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  });

  return (
    <a
      href={file_url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        marginBottom: '10px'
      }}
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
        <p style={{ margin: '0 0 4px', fontSize: '0.9em', color: '#666' }}>
          Загрузка: {date}
        </p>
        {competition_id && (
          <p style={{ margin: 0, fontSize: '0.9em' }}>
            Привязано к соревнованию:&nbsp;
            <a
              href={`/competition/${competition_id}`}
              onClick={e => e.stopPropagation()}
              style={{ textDecoration: 'underline', color: '#007bff' }}
            >
              Подробнее
            </a>
          </p>
        )}
      </div>
    </a>
  );
};

export default DocumentCard;
