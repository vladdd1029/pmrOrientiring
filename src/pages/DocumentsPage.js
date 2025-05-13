import React, { useEffect, useState } from 'react';
import DocumentCard from '../components/cards/DocumentCard';
import { fetchDocuments } from '../services/api';

const DocumentsPage = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocuments()
  }, []);

  const getDocuments = () => {
    setLoading(true);
    fetchDocuments().then(setDocs).catch(console.error);
    setLoading(false);
  }


  return (
    <div style={{ padding: '20px' }}>
      <h1>Документы</h1>
      {loading
        ? <p>Загрузка...</p>
        : docs.length === 0
          ? <p>Пока документов нет.</p>
          : docs.map(doc => (
            <DocumentCard key={doc.id} document={doc} onDeleted={() => getDocuments()} />
          ))
      }
    </div>
  );
};

export default DocumentsPage;
