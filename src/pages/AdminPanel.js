import React, { useState } from 'react';
import Modal from '../components/layout/Modal';
import AddCompetitionForm from '../components/forms/AddCompetitionForm';
import AddNewsForm from '../components/forms/AddNewsForm';
import AddDocumentForm from '../components/forms/AddDocumentForm';
import AddMaterialForm from '../components/forms/AddMaterialForm';
import AddClubForm from '../components/forms/AddClubForm';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [modalType, setModalType] = useState(null);

  const closeModal = () => setModalType(null);

  return (
    <div className='page' >
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
