import React from 'react';
import { Link } from 'react-router-dom';
import { formatRUDate } from '../../utils/formatDate';
import '../../styles/CompetitionCard.css'; // создадим стили ниже

export default function CompetitionCard({ competition }) {
  const { id, title, date, location, image_url } = competition;
  const formattedDate = formatRUDate(date);

  return (
    <Link to={`/competitions/${id}`} className="competition-card">
      <div className="competition-card-img-wrapper">
        {image_url
          ? <img onError={e => { e.currentTarget.src = '/placeholder.png'; }} src={image_url} alt={title} className="competition-card-img" loading="lazy" />
          : <div className="competition-card-img placeholder" />}
      </div>
      <div className="competition-card-body">
        <h3 className="competition-card-title">{title}</h3>
        <p className="competition-card-date"><strong>Дата:</strong> {formattedDate}</p>
        <p className="competition-card-location"><strong>Место:</strong> {location}</p>
      </div>
    </Link>
  );
}
