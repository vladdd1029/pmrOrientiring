import React from 'react';
import { useUser } from '../context/UserContext';

export default function Main() {
  const { user, profile } = useUser();

  return (
    <div className="container">
      {user ? (
        <div>
          <h1>Добро пожаловать, {profile?.fullname || profile?.username || 'Пользователь'}!</h1>
          <h2>{profile?.role == 'admin' && 'Вы администратор'}</h2>
        </div>
      ) : (
        <h1>Добро пожаловать на наш сайт!</h1>
      )}
      <p>Здесь вы найдете информацию о соревнованиях, новостях, календарях и многом другом.</p>
    </div>
  );
}
