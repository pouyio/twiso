import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router';
import { useTranslate } from '../hooks/useTranslate';
import { AuthContext } from 'contexts/AuthContext';
import { AuthOtpResponse } from '@supabase/supabase-js';
import { supabase } from 'utils/supabase';
import { ModalContext } from 'contexts/ModalContext';

const Login: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { session } = useContext(AuthContext);
  const [response, setResponse] = useState<AuthOtpResponse>();
  const { t } = useTranslate();
  const onSend = async (formData: FormData) => {
    const email = formData.get('email') as string;
    supabase.auth
      .signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.href,
        },
      })
      .then((data) => setResponse(data));
  };

  if (session) {
    return <Navigate to="/movies" />;
  }

  return (
    <form className="p-4" action={onSend}>
      {response ? (
        <p>
          {response.error
            ? response.error.message
            : 'Code sent to your email, click in the link to log in!'}
        </p>
      ) : (
        <>
          <label htmlFor="email">Email:</label>
          <input
            name="email"
            type="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 my-3 leading-tight focus:outline-none focus:shadow-outline"
          />

          <button
            type="submit"
            className="disabled:opacity-50 w-full bg-gray-400 disabled:cursor-not-allowed cursor-pointer rounded-sm text-center px-6 py-2"
          >
            {t('login-magic-link')}
          </button>
        </>
      )}
    </form>
  );
};

export const LoginButton: React.FC<{ small?: boolean }> = ({ small }) => {
  const { t } = useTranslate();
  const { toggle } = useContext(ModalContext);

  return (
    <button
      onClick={() => toggle({ custom: <Login /> })}
      className={`bg-gray-400 cursor-pointer rounded-full text-white text-center ${
        small ? 'p-2' : 'px-8 py-2'
      }`}
    >
      <span className="block font-bold">Login</span>
      {!small && <span className="block text-sm">{t('login-perks')}</span>}
    </button>
  );
};
