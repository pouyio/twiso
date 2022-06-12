import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../utils/api';
import { AuthService } from 'utils/AuthService';
import { useTranslate } from 'hooks';

interface ILoginProps {
  code: string;
}

const authService = AuthService.getInstance();

const Login: React.FC<ILoginProps> = ({ code }) => {
  const history = useNavigate();
  const { t } = useTranslate();

  useEffect(() => {
    loginApi(code).then(({ data }) => {
      authService.session = data;
      history('/movies');
    });
  });

  return <h1 className="text-2xl">{t('loading')}...</h1>;
};

export default Login;
