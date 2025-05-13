import React from 'react';
import ReactDOM from 'react-dom';
import '../../styles/LoginRegister.css'; // Стили для модального окна

export default function Modal({ children, isOpen, onClose }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-container" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') // Рендерим в отдельный DOM-узел
  );
}