import React from 'react';

const CompetitionCard = ({ competition }) => {
  const { title, date, location } = competition;

  // Преобразование даты в читаемый формат
  const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '10px'
    }}>
      <h3>{title}</h3>
      <p><strong>Дата:</strong> {formattedDate}</p>
      <p><strong>Место:</strong> {location}</p>
    </div>
  );
};

export default CompetitionCard;
