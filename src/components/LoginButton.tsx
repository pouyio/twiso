import React from 'react';
import { Link } from 'react-router';
import { useTranslate } from '../hooks/useTranslate';

export const LoginButton: React.FC<{ small?: boolean }> = ({ small }) => {
  const { t } = useTranslate();

  return (
    <Link
      className={`bg-gray-400 cursor-pointer rounded-full text-white text-center ${
        small ? 'p-2' : 'px-8 py-2'
      }`}
      to="/login"
    >
      <span className="block font-bold">Login</span>
      {!small && <span className="block text-sm">{t('login-perks')}</span>}
    </Link>
  );
};
