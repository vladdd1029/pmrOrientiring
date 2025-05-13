// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useUser } from './context/UserContext';

import Navbar from './components/navbar/Navbar';
import Main from './pages/Main';
import CompetitionsPage from './pages/CompetitionsPage';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import UserPanel from './pages/UserPanel';
import LoadingElement from './components/LoadingElement'; // если есть компонент

import AdminRoute from './components/AdminRoute';

function App() {
  const { user, isLoading } = useUser();

  if (isLoading) return <LoadingElement />;

  return (
    <Router>
      <Navbar />
      <Switch>
        {/* Публичные */}
        <Route exact path="/" component={Main} />
        <Route path="/competitions" component={CompetitionsPage} />

        {/* Авторизация */}
        <Route
          path="/login"
          render={() => (user ? <Redirect to="/" /> : <Login />)}
        />
        <Route
          path="/register"
          render={() => (user ? <Redirect to="/" /> : <Register />)}
        />

        {/* Кабинет юзера */}
        <Route path="/user" component={UserPanel} />

        {/* Админка */}
        <AdminRoute path="/adminPanel" component={AdminPanel} />

        {/* Всё остальное */}
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </Router>
  );
}

export default App;
