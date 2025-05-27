import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { UserProvider } from './context/UserContext';
import { BrowserRouter as Router } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1) Инициализируем QueryClient
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <Router basename={process.env.PUBLIC_URL}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Router>
  </UserProvider>
);
