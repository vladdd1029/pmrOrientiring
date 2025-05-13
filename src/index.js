import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { UserProvider } from './context/UserContext';
import { BrowserRouter as Router } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
);
