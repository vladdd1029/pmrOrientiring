import React, { useState } from 'react';
import { addClub } from '../../services/api';

const AddClubForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    region: '',
    contacts: ''
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const { name, description, region, contacts } = formData;
    if (!name) {
      setStatus({ success: false, message: 'Введите название клуба.' });
      return;
    }

    try {
      // вызываем централизованную функцию
      await addClub({ name, description, region, contacts });
      setStatus({ success: true, message: 'Клуб добавлен!' });
      setFormData({ name: '', description: '', region: '', contacts: '' });
      if (onSuccess) onSuccess();
    } catch (error) {
      setStatus({ success: false, message: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Добавить клуб</h2>
      <div>
        <label>Название*</label><br />
        <input name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Описание</label><br />
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </div>
      <div>
        <label>Регион</label><br />
        <input name="region" value={formData.region} onChange={handleChange} />
      </div>
      <div>
        <label>Контакты</label><br />
        <input name="contacts" value={formData.contacts} onChange={handleChange} />
      </div>
      <button type="submit">Сохранить</button>
      {status && (
        <div style={{ color: status.success ? 'green' : 'red', marginTop: 10 }}>
          {status.message}
        </div>
      )}
    </form>
  );
};

export default AddClubForm;
