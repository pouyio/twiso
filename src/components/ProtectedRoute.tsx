import { AuthContext } from 'contexts';
import React, { useContext } from 'react';
import { Navigate, RouteProps } from 'react-router';

const ProtectedRoute: React.FC<React.PropsWithChildren<RouteProps>> = ({
  children,
}) => {
  const { session } = useContext(AuthContext);
  return !!session ? <>{children}</> : <Navigate to="/" />;
};

export default ProtectedRoute;
