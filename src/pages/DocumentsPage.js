import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import DocumentCard from '../components/DocumentCard';

const DocumentsPage = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false });
      if (error) console.error('Ошибка загрузки документов:', error.message);
      else setDocs(data);
      setLoading(false);
    };
    loadDocs();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Документы</h1>
      {loading
        ? <p>Загрузка...</p>
        : docs.length === 0
          ? <p>Пока документов нет.</p>
          : docs.map(doc => (
              <DocumentCard key={doc.id} document={doc} />
            ))
      }
    </div>
  );
};

export default DocumentsPage;
