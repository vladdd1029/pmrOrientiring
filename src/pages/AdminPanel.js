import React, { useState } from 'react';
import Modal from '../components/Modal';
import AddCompetitionForm from '../components/AddCompetitionForm';
import AddNewsForm from '../components/AddNewsForm';
import AddDocumentForm from '../components/AddDocumentForm';
import AddMaterialForm from '../components/AddMaterialForm';
import AddClubForm from '../components/AddClubForm';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [modalType, setModalType] = useState(null);

  const closeModal = () => setModalType(null);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Админпанель</h1>
      <div className="admin-cards-grid">
        <div className="admin-card add-card" onClick={() => setModalType('competition')}>
          <div className="plus-icon">＋</div>
          <div>Добавить соревнование</div>
        </div>
        <div className="admin-card add-card" onClick={() => setModalType('news')}>
          <div className="plus-icon">＋</div>
          <div>Добавить новость</div>
        </div>
        <div className="admin-card add-card" onClick={() => setModalType('document')}>
          <div className="plus-icon">＋</div>
          <div>Добавить документ</div>
        </div>
        <div className="admin-card add-card" onClick={() => setModalType('club')}>
          <div className="plus-icon">＋</div>
          <div>Добавить клуб</div>
        </div>
        <div className="admin-card add-card" onClick={() => setModalType('material')}>
          <div className="plus-icon">＋</div>
          <div>Добавить материал</div>
        </div>
      </div>

      <Modal isOpen={modalType !== null} onClose={closeModal}>
        {modalType === 'competition' && <AddCompetitionForm onSuccess={closeModal} />}
        {modalType === 'news' && <AddNewsForm onSuccess={closeModal} />}
        {modalType === 'document' && <AddDocumentForm onSuccess={closeModal} />}
        {modalType === 'club' && <AddClubForm onSuccess={closeModal} />}
        {modalType === 'material' && <AddMaterialForm onSuccess={closeModal} />}
      </Modal>
    </div>
  );
}
export default AdminPanel;
