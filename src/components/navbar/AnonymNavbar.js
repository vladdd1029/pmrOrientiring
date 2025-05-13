import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function AnonymNavbar() {
  const location = useLocation(); // Получаем текущий location

  return (
    <>
      <li>
        <NavLink
          to="/login"
          state={{ background: location }}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Вход
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/register"
          state={{ background: location }}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Регистрация
        </NavLink>
      </li>
    </>
  );
}
