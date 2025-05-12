import React, { useEffect, useState } from 'react';
import {  useUser } from './context/UserContext';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import Main from './pages/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import './styles/App.css';
import UserPanel from './pages/UserPanel';
import AdminPanel from './pages/AdminPanel';

function App() {
  const { user, profile, isLoading } = useUser(); // ← из контекста

  const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        isLoading ? null : user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );

  if (isLoading) {
    return <div>Загрузка...</div>;
  }
  return (
      <Router>
        <div className="App">
          <Navbar />
          <Switch>
            <Route path="/" component={Main} exact />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            {profile?.role === 'admin' && (
              <ProtectedRoute path="/adminPanel" component={AdminPanel} />
            )}
            <ProtectedRoute path="/userPanel" component={UserPanel} />
          </Switch>
        </div>
      </Router>
  );
}

export default App;