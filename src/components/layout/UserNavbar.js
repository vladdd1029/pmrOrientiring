import React from 'react'
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min'

export default function UserNavbar({ profile, handleLogout }) {
    return (<>
        {profile?.role === "admin" && (
            <>
                <li>
                    <NavLink to="/adminPanel" activeClassName="active">
                        Админ-панель
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/applications" activeClassName="active">
                        Заявки тренеров
                    </NavLink>
                </li>
            </>
        )}
        <li>
            <NavLink to="/profile" activeClassName="active">Профиль</NavLink>
        </li>

    </>)
}
