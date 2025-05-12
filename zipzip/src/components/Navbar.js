import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useUser } from "../context/UserContext";
import { supabase } from "../supabaseClient";
import "../styles/Navbar.css"; // Импортируем CSS для Navbar

export default function Navbar() {
    const { user, profile, setUser, isLoading } = useUser();
    const history = useHistory();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Ошибка выхода:', error.message);
        } else {
            setUser(null); // сбрасываем
            history.push('/login');
        }
    };

    if (isLoading) {
        return <nav className="navbar"><p>Загрузка...</p></nav>;
    }
    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/">Главная</Link></li>
                {user ? (
                    <>
                        <li><Link to="/userPanel">Пользовательская панель</Link></li>
                        {profile?.role === 'admin' && (
                            <li><Link to="/adminPanel">Админ-панель</Link></li>
                        )}
                        <li><button onClick={handleLogout} className="logout-button">Выйти</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Вход</Link></li>
                        <li><Link to="/register">Регистрация</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}
