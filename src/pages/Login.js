import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Modal from '../components/Modal';
import LoadingElement from '../components/LoadingElement';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';

export default function Login({ isOpen, onClose }) {
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true; // Флаг для проверки, размонтирован ли компонент

    return () => {
      isMounted = false; // Устанавливаем флаг при размонтировании
    };
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    setMessage('');

    let emailToLogin = input;

    // Если введен не email, ищем пользователя по username
    if (!input.includes('@')) {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', input)
        .single();

      if (!data) {
        setMessage('Пользователь не найден');
        setIsLoading(false);
        return;
      }
      if (error) {
        setMessage('Ошибка при поиске пользователя: ' + error.message);
        setIsLoading(false);
        return;
      }

      emailToLogin = data.email;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: emailToLogin,
      password,
    });

    if (error) {
      setMessage(`Ошибка: ${error.message}`);
    } else {
      setMessage('Вход выполнен успешно!');
      onClose(); // Закрываем модальное окно
    }

    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='modal-content'>
        <h1>Вход</h1>
        <input
          type="text"
          placeholder="Email или логин"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {message && <p>{message}</p>}
      </div>
      <div className="modal-footer">
        <NavLink to="/register" onClick={onClose}>
          <p>Нет аккаунта?</p>
        </NavLink>
        <button onClick={handleLogin} disabled={isLoading}>
          {isLoading ? <LoadingElement /> : 'Войти'}
        </button>
      </div>
    </Modal>
  );
}
