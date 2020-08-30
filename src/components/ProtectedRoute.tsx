import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { RouteProps } from 'react-router';
import { AuthService } from 'utils/AuthService';

const authService = AuthService.getInstance();
const ProtectedRoute: React.FC<RouteProps> = ({ children, ...props }) => {
  return (
    <Route {...props}>
      {authService.isLoggedIn() ? children : <Redirect to="/" />}
    </Route>
  );
};

export default ProtectedRoute;
