import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function AnonymNavbar() {
    const location = useLocation();

    return (
        <>
            <li>
                <NavLink
                    to={{ pathname: "/login", state: { background: location.pathname } }}
                    activeClassName="active"
                    exact
                >
                    Вход
                </NavLink>
            </li>
            <li>
                <NavLink
                    to={{ pathname: "/register", state: { background: location.pathname } }}
                    activeClassName="active"
                >
                    Регистрация
                </NavLink>
            </li>
        </>
    );
}
