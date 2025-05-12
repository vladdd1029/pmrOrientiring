import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useHistory } from 'react-router-dom';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [message, setMessage] = useState('');
    const history = useHistory();  // Используем useHistory для редиректа

    const handleRegister = async () => {
        // Регистрация с помощью Supabase
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signUpError) {
            console.error('Ошибка регистрации:', signUpError.message);
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
            console.error('Ошибка создания профиля:', profileError.message);
            setMessage(`Ошибка профиля: ${profileError.message}`);
            return; // Завершаем выполнение функции
        }
    };

    return (
        <div>
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
            <button onClick={handleRegister}>Зарегистрироваться</button>
            {message && <p>{message}</p>}
        </div>
    );
}
