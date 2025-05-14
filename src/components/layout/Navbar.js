import { NavLink } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import '../../styles/Navbar.css';
import UserNavbar from './UserNavbar';
import AnonymNavbar from './AnonymNavbar';

export default function Navbar() {
  const { user, profile, isLoading } = useUser();

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
        <li>
          <NavLink to="/documents" activeClassName="active">Документы</NavLink>
        </li>
        <li>
          <NavLink to="/clubs" exact activeClassName="active">
            Клубы
          </NavLink>
        </li>
        <li>
          <NavLink to="/materials" exact activeClassName="active">
            Материалы
          </NavLink>
        </li>

        {user
          ? <UserNavbar profile={profile} />
          : <AnonymNavbar />
        }
      </ul>
    </nav>
  );
}
