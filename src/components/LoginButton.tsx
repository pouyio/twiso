import React, { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useTranslate } from '../hooks/useTranslate';
import { AuthContext } from 'contexts/AuthContext';
import { AuthOtpResponse } from '@supabase/supabase-js';
import { supabase } from 'utils/supabase';
import { ModalContext } from 'contexts/ModalContext';

const Login: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { session } = useContext(AuthContext);
  const [response, setResponse] = useState<AuthOtpResponse>();
  const [showCode, setShowCode] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { toggle } = useContext(ModalContext);

  const onSend = async (formData: FormData) => {
    const email = formData.get('email') as string;
    if (!email) {
      return;
    }
    supabase.auth
      .signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.href,
        },
      })
      .then((data) => {
        setShowCode(true);
        setResponse(data);
      });
  };

  const validateCode = () => {
    if (!code) {
      return;
    }
    supabase.auth
      .verifyOtp({
        email,
        token: code,
        type: 'email',
      })
      .then(({ error }) => {
        toggle();
        if (error) {
          console.error(error);
          navigate('/profile');
        } else {
          navigate('/movies');
        }
      });
  };

  if (session) {
    return <Navigate to="/movies" />;
  }

  return (
    <>
      <form className="p-4" action={onSend}>
        {showCode ? (
          <div>
            <p>{response?.error ? response?.error.message : t('code-sent')}</p>
            <p className="text-sm text-gray-600 py-1">Email: {email}</p>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              name="opt-code"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 my-3 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              onClick={() => validateCode()}
              type="submit"
              className="w-full bg-gray-400 cursor-pointer rounded-sm text-center px-6 py-2"
            >
              {t('login-code')}
            </button>
          </div>
        ) : (
          <>
            <label htmlFor="email">Email:</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              name="email"
              type="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 my-3 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              type="submit"
              className="w-full bg-gray-400 cursor-pointer rounded-sm text-center px-6 py-2"
            >
              {t('login-magic-link')}
            </button>
          </>
        )}
      </form>
      <div className="flex justify-center">
        <button
          onClick={() => setShowCode((c) => !c)}
          className="underline cursor-pointer text-center px-6 py-2"
        >
          {showCode ? t('login-magic-link') : t('already-have-code')}
        </button>
      </div>
    </>
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
