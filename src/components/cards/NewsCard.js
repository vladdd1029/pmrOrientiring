// src/components/NewsCard.js
import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { Link } from 'react-router-dom';
import DeleteModal from '../layout/DeleteModal';
import { useQueryClient } from '@tanstack/react-query';
import { fetchNewsItem } from '../../services/api';

export default function NewsCard({ news, onDeleted }) {
  const { profile } = useUser();
  const [showDel, setShowDel] = useState(false);
  const queryClient = useQueryClient();


  return (
    <>
      <Link
        to={`/news/${news.id}`}
        onMouseEnter={() => {
          queryClient.prefetchQuery({
            queryKey: ['news', news.id],
            queryFn: () => fetchNewsItem(news.id),
            staleTime: 1000 * 60 * 5,
          });
        }}
        style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card">
          <h3>{news.title}</h3>
          <p>{new Date(news.created_at).toLocaleDateString('ru-RU')}</p>
          <p>{news.content?.slice(0, 100)}…</p>
        </div>
      </Link>

      {profile?.role === 'admin' && (
        <button className="delete-btn" onClick={() => setShowDel(true)}>×</button>
      )}

      <DeleteModal
        itemType="news"
        item={{
          id: news.id,
          title: news.title,
          competition_id: news.competition_id
        }}
        isOpen={showDel}
        onClose={() => setShowDel(false)}
        onDeleted={onDeleted}
      />
    </>
  );
}
