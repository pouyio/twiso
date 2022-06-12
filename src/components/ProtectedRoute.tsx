import React from 'react';
import { Navigate, RouteProps } from 'react-router';
import { AuthService } from 'utils/AuthService';

const authService = AuthService.getInstance();
const ProtectedRoute: React.FC<React.PropsWithChildren<RouteProps>> = ({
  children,
}) => {
  return authService.isLoggedIn() ? <>{children}</> : <Navigate to="/" />;
};

export default ProtectedRoute;
