import React from 'react';
import { Link } from 'react-router-dom';
import { truncate } from '../../utils/helpers';
import '../../styles/NewsCard.css'; // создадим стили ниже

export default function NewsCard({ news }) {
  const { id, title, content, image_url, created_at } = news;
  const preview = truncate(content, 100);

  return (
    <Link to={`/news/${id}`} className="news-card">

        <div className="news-card-img-wrapper">
          {image_url
            ? <img onError={e => { e.currentTarget.src = '/placeholder.png'; }}
              src={image_url} alt={title} className="news-card-img" loading="lazy" />
            : <div className="news-card-img placeholder" />}
        </div>
      
      <div className="news-card-body">
        <h3 className="news-card-title">{title}</h3>
        <p className="news-card-preview">{preview}</p>
      </div>
    </Link>
  );
}
