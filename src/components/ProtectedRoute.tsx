import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../utils/AuthContext';
import { RouteProps } from 'react-router';

const ProtectedRoute: React.FC<RouteProps> = ({ children, ...props }) => {
  const { session } = useContext(AuthContext);
  return <Route {...props}>{session ? children : <Redirect to="/" />}</Route>;
};

export default ProtectedRoute;
