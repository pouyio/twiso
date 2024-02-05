import React from 'react';
import { useLocation } from 'react-router-dom';
const redirect_url = import.meta.env.VITE_REDIRECT_URL;

export const LoginButton: React.FC<{ small?: boolean }> = ({ small }) => {
  const location = useLocation();

  const onClick = () => {
    localStorage.setItem('redirect_path', location.pathname);
  };

  return (
    <a
      className={`bg-gray-400 cursor-pointer rounded-full text-white ${
        small ? 'p-2' : 'px-12 py-3'
      }`}
      style={{ lineHeight: '2em' }}
      onClick={onClick}
      href={`https://trakt.tv/oauth/authorize?response_type=code&client_id=61afe7ed7ef7a2b6b2193254dd1cca580ba8dee91490df454d78fd68aed7e5f9&redirect_uri=${redirect_url}`}
    >
      Login
    </a>
  );
};
