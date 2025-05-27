import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDocuments } from '../services/api';
import DocumentCard from '../components/cards/DocumentCard';

export default function DocumentsPage() {
  const { data: documents = [], error, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: fetchDocuments,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <p className='loading-text'>Загрузка документов…</p>;
  }
  if (error) {
    return <p className='error-text'>Ошибка: {error.message}</p>;
  }

  return (
    <div className='page' >
      <h1>Документы</h1>
      {documents.length === 0 ? (
        <p>Документов пока нет.</p>
      ) : (
        <div>
          {documents.map(doc => (
          <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
// src/pages/DocumentsPage.js