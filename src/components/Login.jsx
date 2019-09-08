import React, { useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import AuthContext from '../utils/AuthContext';
import { loginApi } from '../utils/api';

const Login = withRouter(({ code, history }) => {
  const { persistSession } = useContext(AuthContext);

  useEffect(() => {
    loginApi(code).then(({ data }) => {
      persistSession(data);
      history.push('/movies');
    });
  });

  return <h1 className="text-2xl">Loading...</h1>;
});

export default Login;
