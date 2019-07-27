import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../utils/AuthContext';

export const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { session } = useContext(AuthContext);
    return (
        <Route {...rest} render={props =>
            session ?
                <Component {...props} />
                : <Redirect to="/" />
        }
        />
    )

}
