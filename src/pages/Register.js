import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import Modal from '../components/Modal';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';

export default function Register({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    setMessage('');

    // Регистрация пользователя
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setMessage(`Ошибка: ${signUpError.message}`);
      return;
    }

    const user = signUpData.user;
    if (!user) {
      setMessage('Регистрация прошла, но пользователь не определён.');
      return;
    }

    if (!username || !fullname) {
      setMessage('Пожалуйста, заполните все поля.');
      return;
    }

    // Сохранение профиля пользователя
    const { error: profileError } = await supabase.from('profiles').upsert([
      {
        id: user.id,
        username,
        fullname,
        email,
        role: 'user',
      },
    ]);

    if (profileError) {
      setMessage(`Ошибка профиля: ${profileError.message}`);
      return;
    }

    setMessage('Регистрация успешна!');
    onClose(); // Закрываем модальное окно
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal-content">
        <h1>Регистрация</h1>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="input-row">
          <input
            placeholder="Никнейм"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="Полное имя"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>
      </div>
      <div className="modal-footer">
        <NavLink to="/login" onClick={onClose}>
          <p>Уже есть аккаунт?</p>
        </NavLink>
        <button onClick={handleRegister}>Зарегистрироваться</button>
      </div>
      {message && <p>{message}</p>}
    </Modal>
  );
}
