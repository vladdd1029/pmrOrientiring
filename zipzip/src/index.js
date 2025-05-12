import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import { UserProvider } from './context/UserContext';

ReactDOM.render(
  <UserProvider>
    <App />
  </UserProvider>,
  document.getElementById('root')
);