// src/components/DocumentCard.js
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import DeleteModal from './DeleteModal';

export default function DocumentCard({ document, onDeleted }) {
  const { profile } = useUser();
  const [showDel, setShowDel] = useState(false);

  return (
    <>
      <a href={document.file_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card">
          <h3>{document.title}</h3>
          <p>Загрузка: {new Date(document.uploaded_at).toLocaleDateString('ru-RU')}</p>
        </div>
      </a>

      {profile?.role === 'admin' && (
        <button className="delete-btn" onClick={() => setShowDel(true)}>×</button>
      )}

      <DeleteModal
        itemType="document"
        item={document}
        isOpen={showDel}
        onClose={() => setShowDel(false)}
        onDeleted={onDeleted}
      />
    </>
  );
}
