// src/utils/formatDate.js

/**
 * Форматирует ISO-строку даты в «1 января 2025» по-русски.
 * @param {string} isoString 
 * @returns {string}
 */
export function formatRUDate(isoString) {
  if (!isoString) return '';
  const dt = new Date(isoString);
  return dt.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Форматирует ISO-строку даты в короткий «dd.mm.yy».
 * @param {string} isoString 
 * @returns {string}
 */
export function formatShortDate(isoString) {
  if (!isoString) return '';
  const dt = new Date(isoString);
  return dt.toLocaleDateString('ru-RU', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });
}
