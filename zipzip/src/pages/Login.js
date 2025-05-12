import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useHistory } from 'react-router-dom';

export default function Login() {
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const handleLogin = async () => {
    setIsLoading(true);  // Старт загрузки
    setMessage('');

    let emailToLogin = input;

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
      setIsLoading(false);
      return; // Завершаем выполнение функции
    } else {
      setMessage('Вход выполнен успешно!');
      history.push('/');
    }

    setIsLoading(false); // Завершение загрузки
  };

  return (
    <div>
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

      <button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? (
          <span className="spinner" />
        ) : (
          'Войти'
        )}
      </button>

      {message && <p>{message}</p>}

      {/* Немного стилей для спиннера */}
      <style>{`
        .spinner {
          width: 18px;
          height: 18px;
          border: 3px solid #ccc;
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
