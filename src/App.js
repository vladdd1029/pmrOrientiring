import React from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory, useLocation, Redirect } from 'react-router-dom';
import { useUser } from './context/UserContext';
import Navbar from './components/navbar/Navbar';
import Main from './pages/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import './styles/App.css';
import UserPanel from './pages/UserPanel';
import AdminPanel from './pages/AdminPanel';
import LoadingElement from './components/LoadingElement';

function App() {
  const { user, profile, isLoading } = useUser(); // ← из контекста
  const location = useLocation();
  const history = useHistory();

  // Проверяем, является ли текущий маршрут модальным
  const background = location.state && location.state.background;

  const closeModal = () => {
    history.push('/'); // Возвращаемся на главную страницу
  };

  const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { user, isLoading } = useUser();

    if (isLoading) {
      return null; // Пока данные загружаются, ничего не рендерим
    }

    return (
      <Route
        {...rest}
        render={(props) =>
          user ? <Component {...props} /> : <Redirect to="/login" />
        }
      />
    );
  };

  if (isLoading) {
    return (<LoadingElement />); // Загрузка данных
  }

  return (
    <div className="App">
      <Navbar />
      <Switch location={background || location}>
        <Route path="/" component={Main} exact />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        {profile?.role === 'admin' && (
          <ProtectedRoute path="/adminPanel" component={AdminPanel} />
        )}
      </Switch>

      {/* Модальные окна */}
      {background && (
        <>
          <Route
            path="/login"
            render={() => <Login isOpen={true} onClose={closeModal} />}
          />
          <Route
            path="/register"
            render={() => <Register isOpen={true} onClose={closeModal} />}
          />
        </>
      )}
    </div>
  );
}

export default App;