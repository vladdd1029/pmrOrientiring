// src/utils/helpers.js

/**
 * Обрезает текст до заданной длины, добавляя «…» в конце.
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export function truncate(text, maxLength = 100) {
  if (!text) return '';
  return text.length > maxLength
    ? text.slice(0, maxLength) + '…'
    : text;
}

/**
 * Пример: получает URL изображения или возвращает дефолт.
 * @param {string|null} url 
 * @param {string} defaultUrl 
 */
export function defaultOr(url, defaultUrl) {
  return url || defaultUrl;
}
