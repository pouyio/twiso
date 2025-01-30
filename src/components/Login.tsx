import { AuthContext } from 'contexts/AuthContext';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { loginApi } from '../utils/api';
import { useTranslate } from '../hooks/useTranslate';

interface ILoginProps {
  code: string;
}

const Login: React.FC<ILoginProps> = ({ code }) => {
  const history = useNavigate();
  const { t } = useTranslate();

  const { setSession } = useContext(AuthContext);

  useEffect(() => {
    loginApi(code).then(({ data }) => {
      setSession(data);
      const redirectPath = localStorage.getItem('redirect_path');
      if (redirectPath) {
        localStorage.removeItem('redirect_path');
        history(redirectPath);
      } else {
        history('/movies');
      }
    });
  });

  return <h1 className="text-2xl">{t('loading')}...</h1>;
};

export default Login;
