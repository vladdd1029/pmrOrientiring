import React, { useState } from 'react';
import Modal from '../components/Modal';                // ваш компонент
import AddCompetitionForm from '../components/AddCompetitionForm';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [modal, setModal] = useState(null); // 'competition' | null

  return (
    <div style={{ padding: '20px' }}>
      <h1>Админпанель</h1>

      <div className="admin-cards-grid">
        {/* Карточка добавления нового соревнования */}
        <div
          className="admin-card add-card"
          onClick={() => setModal('competition')}
        >
          <div className="plus-icon">＋</div>
          <div>Добавить соревнование</div>
        </div>
      </div>

      <Modal
        isOpen={modal === 'competition'}
        onClose={() => setModal(null)}
      >
        <AddCompetitionForm onSuccess={() => setModal(null)} />
      </Modal>
    </div>
  );
};

export default AdminPanel;
