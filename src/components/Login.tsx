import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../utils/AuthContext';
import { loginApi } from '../utils/api';

interface ILoginProps {
  code: string;
}

const Login = ({ code }: ILoginProps) => {
  const history = useHistory();
  const { persistSession } = useContext(AuthContext);

  useEffect(() => {
    loginApi(code).then(({ data }) => {
      persistSession(data);
      history.push('/movies');
    });
  });

  return <h1 className="text-2xl">Loading...</h1>;
};

export default Login;
