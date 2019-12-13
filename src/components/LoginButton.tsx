import React from 'react';
const redirect_url = process.env.REACT_APP_REDIRECT_URL;

const LoginButton: React.FC = () => {
  return (
    <a
      className="bg-gray-300 py-3 px-12 rounded-full text-white"
      href={`https://trakt.tv/oauth/authorize?response_type=code&client_id=61afe7ed7ef7a2b6b2193254dd1cca580ba8dee91490df454d78fd68aed7e5f9&redirect_uri=${redirect_url}`}
    >
      Log in and keep track of this!
    </a>
  );
};

export default LoginButton;
