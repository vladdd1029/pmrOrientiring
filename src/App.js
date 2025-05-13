// src/App.js
import React from 'react';
import { Route, Switch, Redirect, useHistory, useLocation } from 'react-router-dom';
import { useUser } from './context/UserContext';

import Navbar from './components/navbar/Navbar';

import Main from './pages/Main';
import CompetitionsPage from './pages/CompetitionsPage';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import UserPanel from './pages/UserPanel';
import LoadingElement from './components/LoadingElement';
import AdminRoute from './components/AdminRoute';
import NewsPage from './pages/NewsPage';
import NewsDetail from './pages/Newsdetail';
import CompetitionDetail from './pages/CompetitionDetail';

function App() {
  const { user, isLoading } = useUser();
  const location = useLocation();
  const history = useHistory();

  // теперь background — строка пути или undefined
  const background = location.state && location.state.background;

  if (isLoading) return <LoadingElement />;

  return (
    <>
      <Navbar />
      <Switch>
        {/* Публичные */}
        <Route exact path="/" component={Main} />

        <Route path="/competitions" component={CompetitionsPage} />
        <Route path="/competition/:id" component={CompetitionDetail} />
        
        <Route path="/news" exact component={NewsPage} />
        <Route path="/news/:id" component={NewsDetail} />
        {/* Авторизация */}
        {background && (
          <>
            <Route
              path="/login"
              render={() => (
                <Login
                  isOpen={true}
                  onClose={() => history.push(background)}
                />
              )}
            />
            <Route
              path="/register"
              render={() => (
                <Register
                  isOpen={true}
                  onClose={() => history.push(background)}
                />
              )}
            />
          </>
        )}

        {/* Кабинет юзера */}
        <Route path="/user" component={UserPanel} />

        {/* Админка */}
        <AdminRoute path="/adminPanel" component={AdminPanel} />

        {/* Всегда редирект на главную */}
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </>
  );
}

export default App;
