import React from 'react';
import { FiFileText, FiFile } from 'react-icons/fi';
import '../../styles/DocumentCard.css'; // создадим стили ниже

export default function DocumentCard({ document }) {
  const { id, title, file_url } = document;
  const ext = file_url.split('.').pop().toLowerCase();

  let content;
  if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(ext)) {
    // превью для изображений
    content = <img onError={e => { e.currentTarget.src = '/placeholder.png'; }} src={file_url} alt={title} className="doc-card-img" loading="lazy" />;
  } else if (ext === 'pdf') {
    content = <FiFileText size={48} />;
  } else {
    content = <FiFile size={48} />;
  }

  return (
    <a
      href={file_url}
      target="_blank"
      rel="noopener noreferrer"
      className="document-card"
    >
      <div className="doc-card-icon">
        {content}
      </div>
      <div className="doc-card-title">{title}</div>
    </a>
  );
}
