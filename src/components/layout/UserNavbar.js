import React from 'react'
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min'

export default function UserNavbar({ profile, handleLogout }) {
    return (<>
        {profile?.role === "admin" && (
            <li>
                <NavLink to="/adminPanel" activeClassName="active">
                    Админ-панель
                </NavLink>
            </li>
        )}
        <li>
            <button onClick={handleLogout} className="logout-button">
                Выйти
            </button>
        </li>
    </>)
}
