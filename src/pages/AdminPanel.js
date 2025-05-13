import React from 'react';
import AddCompetitionForm from '../components/AddCompetitionForm';

const AdminPanel = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Админпанель</h1>
      <AddCompetitionForm />
    </div>
  );
};

export default AdminPanel;
// This is a simple admin panel page that imports and uses the AddCompetitionForm component.