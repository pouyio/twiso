import React from 'react';
const redirect_url = process.env.REACT_APP_REDIRECT_URL;

export const LoginButton: React.FC<{ small?: boolean }> = ({ small }) => {
  return (
    <a
      className={`bg-gray-400 rounded-full text-white ${
        small ? 'p-2' : 'px-12 py-3'
      }`}
      style={{ lineHeight: '2em' }}
      href={`https://trakt.tv/oauth/authorize?response_type=code&client_id=61afe7ed7ef7a2b6b2193254dd1cca580ba8dee91490df454d78fd68aed7e5f9&redirect_uri=${redirect_url}`}
    >
      Login
    </a>
  );
};
