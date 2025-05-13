import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import MaterialCard from '../components/cards/MaterialCard';
import { fetchMaterials } from '../services/api';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMaterials()
  }, []);

  const getMaterials = () => {
    setLoading(true);
    fetchMaterials().then(setMaterials).catch(console.error);
    setLoading(false);
  }
  return (
    <div style={{ padding: '20px' }}>
      <h1>Учебные материалы</h1>
      {loading
        ? <p>Загрузка...</p>
        : materials.length === 0
          ? <p>Материалов пока нет.</p>
          : materials.map(m => <MaterialCard key={m.id} material={m} />)
      }
    </div>
  );
}
