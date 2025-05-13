import { NavLink } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { supabase } from "../../supabaseClient";
import "../../styles/Navbar.css";
import UserNavbar from "./UserNavbar";
import AnonymNavbar from "./AnonymNavbar";




export default function Navbar() {
    const { user, profile, setUser, isLoading } = useUser();

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
        } catch (error) {
            console.error("Ошибка выхода:", error.message);
        }
    };

    if (isLoading) {
        return (
            <nav className="navbar">
                <p>Загрузка...</p>
            </nav>
        );
    }

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <NavLink exact to="/" activeClassName="active">
                        Главная
                    </NavLink>
                    <NavLink to="/competitions" activeClassName="active">
                        Соревнования</NavLink>
                </li>
                {user ? (<UserNavbar profile={profile} handleLogout={handleLogout} />) : (<AnonymNavbar />)}
            </ul>
        </nav>
    );
}
