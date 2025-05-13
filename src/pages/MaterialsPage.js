import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import MaterialCard from '../components/MaterialCard';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('materials')
      .select('*')
      .order('title', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error(error.message);
        else setMaterials(data);
        setLoading(false);
      });
  }, []);

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
