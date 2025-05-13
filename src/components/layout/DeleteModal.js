// src/components/DeleteModal.js
import React, { useState } from 'react';
import Modal from './Modal';
import { supabase } from '../../services/supabaseClient';

export default function DeleteModal({
  itemType,   // 'competition' | 'news' | 'document'
  item,       // объект, который удаляем
  isOpen,
  onClose,
  onDeleted,  // callback после успешного удаления
}) {
  const [deleteRelated, setDeleteRelated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);

    try {
      if (itemType === 'competition') {
        if (deleteRelated) {
          // удаляем все новости и документы
          await supabase.from('news')
            .delete().eq('competition_id', item.id);
          await supabase.from('documents')
            .delete().eq('competition_id', item.id);
        } else {
          // отвязываем документы — сохраняем их привязку к новости, если она есть
          await supabase.from('documents')
            .update({ competition_id: null })
            .eq('competition_id', item.id);
        }
      }

      if (itemType === 'news') {
        if (deleteRelated) {
          // удаляем само соревнование и документы к новости
          await supabase.from('competitions')
            .delete().eq('id', item.competition_id);
          await supabase.from('documents')
            .delete().eq('news_id', item.id);
        } else {
          // отвязываем документы от этой новости
          await supabase.from('documents')
            .update({ news_id: null })
            .eq('news_id', item.id);
        }
      }

      // наконец, удаляем сам объект
      const table = itemType === 'competition'
        ? 'competitions'
        : itemType === 'news'
          ? 'news'
          : 'documents';

      await supabase.from(table)
        .delete()
        .eq('id', item.id);

      onDeleted(item.id);
      onClose();
    } catch (err) {
      alert('Ошибка удаления: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const labels = {
    competition: 'соревнование',
    news:        'новость',
    document:    'документ'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Удалить {labels[itemType]}</h2>
      <p>Вы уверены, что хотите удалить «{item.title || item.name}»?</p>

      {(itemType === 'competition' || itemType === 'news') && (
        <label style={{ display: 'block', margin: '12px 0' }}>
          <input
            type="checkbox"
            checked={deleteRelated}
            onChange={e => setDeleteRelated(e.target.checked)}
          />{' '}
          {itemType === 'competition'
            ? 'Удалить все новости и документы, связанные с этим соревнованием'
            : 'Удалить связанное соревнование и все документы для этой новости'}
        </label>
      )}

      <button onClick={handleConfirm} disabled={loading}>
        {loading ? 'Удаление…' : 'Удалить'}
      </button>
      <button onClick={onClose} disabled={loading} style={{ marginLeft: 10 }}>
        Отмена
      </button>
    </Modal>
  );
}
