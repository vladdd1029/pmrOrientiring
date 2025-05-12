import React from 'react'
import { NavLink, useLocation } from 'react-router-dom/cjs/react-router-dom.min'

export default function AnonymNavbar() {
    const location = useLocation(); // Получаем текущий location

    return (
        <>
            <li>
                <NavLink
                    to={{
                        pathname: "/login",
                        state: { background: location }, // Передаем background
                    }}
                    activeClassName="active"
                >
                    Вход
                </NavLink>
            </li>
            <li>
                <NavLink
                    to={{
                        pathname: "/register",
                        state: { background: location }, // Передаем background
                    }}
                    activeClassName="active"
                >
                    Регистрация
                </NavLink>
            </li>
        </>
    )
}
