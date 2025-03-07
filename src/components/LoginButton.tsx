import React from 'react';
import { useLocation } from 'react-router';
import { useTranslate } from '../hooks/useTranslate';
const redirect_url = import.meta.env.VITE_REDIRECT_URL;

export const LoginButton: React.FC<{ small?: boolean }> = ({ small }) => {
  const location = useLocation();
  const { t } = useTranslate();

  const onClick = () => {
    localStorage.setItem('redirect_path', location.pathname);
  };

  return (
    <a
      className={`bg-gray-400 cursor-pointer rounded-full text-white text-center ${
        small ? 'p-2' : 'px-8 py-2'
      }`}
      onClick={onClick}
      href={`https://trakt.tv/oauth/authorize?response_type=code&client_id=61afe7ed7ef7a2b6b2193254dd1cca580ba8dee91490df454d78fd68aed7e5f9&redirect_uri=${redirect_url}`}
    >
      <span className="block font-bold">Login</span>
      {!small && <span className="block text-sm">{t('login-perks')}</span>}
    </a>
  );
};
