import React, { createContext, useEffect, useState } from 'react';
import { refreshApi } from 'utils/api';

export interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

interface AuthContextProps {
  session: Session | null;
  setSession: (session: Session) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  session: null,
  setSession: () => null,
});

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(
    JSON.parse(localStorage.getItem('session') || 'null')
  );

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session') || 'null');

    if (session) {
      setSession(session);
      if (
        new Date() > new Date((+session.created_at + session.expires_in) * 1000)
      ) {
        refreshApi(session.refresh_token).then(({ data }) => {
          setSession(data);
        });
      }
    }
  }, []);

  const localSetSession = (session: Session | null) => {
    const sessionStr = JSON.stringify(session);
    localStorage.setItem('session', sessionStr);
    setSession(session);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        setSession: localSetSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
