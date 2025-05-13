// src/components/AdminRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const AdminRoute = ({ component: Component, ...rest }) => {
  const { user, profile, isLoading } = useUser();

  return (
    <Route
      {...rest}
      render={props => {
        if (isLoading) return null;              // или <LoadingElement />
        if (!user || profile.role !== 'admin') {
          return <Redirect to="/" />; 
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default AdminRoute;
