import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../contexts';
import { loginApi } from '../utils/api';
import { useRouter } from 'next/router';

interface ILoginProps {
  code: string;
}

const Login: React.FC<ILoginProps> = ({ code }) => {
  const { persistSession } = useContext(AuthContext);
  const { push } = useRouter();

  useEffect(() => {
    loginApi(code).then(({ data }) => {
      persistSession(data);
      push('/movie');
    });
  });

  return <h1 className="text-2xl">Loading...</h1>;
};

export default Login;
