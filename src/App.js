// src/App.js
import React from 'react';
import { Route, Switch, Redirect, useHistory, useLocation } from 'react-router-dom';
import { useUser } from './context/UserContext';

import AdminRoute from './components/AdminRoute';


import Navbar from './components/layout/Navbar';
import LoadingElement from './components/LoadingElement';

import Main from './pages/Main';
import CompetitionsPage from './pages/CompetitionsPage';
import CompetitionDetail from './pages/CompetitionDetail';
import NewsPage from './pages/NewsPage';
import NewsDetail from './pages/NewsDetail';
import CalendarPage from './pages/CalendarPage';
import DocumentsPage from './pages/DocumentsPage';
import ClubsPage from './pages/ClubsPage';
import ClubDetail from './pages/ClubDetail';
import MaterialsPage from './pages/MaterialsPage';
import MaterialDetail from './pages/MaterialDetail';
import Register from './pages/Register';
import Login from './pages/Login';
import UserPanel from './pages/UserPanel';
import AdminPanel from './pages/AdminPanel';

import './styles/index.css';

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

        <Route path="/calendar" component={CalendarPage} />

        <Route path="/documents" component={DocumentsPage} />

        <Route exact path="/clubs" component={ClubsPage} />
        <Route path="/clubs/:id" component={ClubDetail} />

        <Route exact path="/materials" component={MaterialsPage} />
        <Route path="/materials/:id" component={MaterialDetail} />

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
