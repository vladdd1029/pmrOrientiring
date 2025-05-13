import { NavLink } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { supabase } from '../../supabaseClient';
import '../../styles/Navbar.css';
import UserNavbar from './UserNavbar';
import AnonymNavbar from './AnonymNavbar';

export default function Navbar() {
  const { user, profile, setUser, isLoading } = useUser();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error.message);
    else setUser(null);
  };

  if (isLoading) {
    return <nav className="navbar"><p>Загрузка...</p></nav>;
  }

  return (
    <nav className="navbar">
      <ul>
        <li>
          <NavLink exact to="/" activeClassName="active">Главная</NavLink>
        </li>
        <li>
          <NavLink to="/competitions" activeClassName="active">Соревнования</NavLink>
        </li>
        <li>
          <NavLink to="/news" activeClassName="active">Новости</NavLink>
        </li>
        <li>
          <NavLink to="/calendar" exact activeClassName="active">Календарь</NavLink>
        </li>
        {user
          ? <UserNavbar profile={profile} handleLogout={handleLogout} />
          : <AnonymNavbar />
        }
      </ul>
    </nav>
  );
}
