import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { refreshApi } from 'utils/api';

export interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

export const AuthContext = createContext<{
  session: Session | null;
  persistSession: (session: Session) => void;
}>({
  session: null,
  persistSession: (session: Session) => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(
    JSON.parse(localStorage.getItem('session') || 'null')
  );

  useEffect(() => {
    if (session) {
      if (
        new Date() > new Date((+session.created_at + session.expires_in) * 1000)
      ) {
        refreshApi(session.refresh_token).then(({ data }) =>
          persistSession(data)
        );
      }
    }
    // eslint-disable-next-line
  }, []);

  const persistSession = (session: Session) => {
    const sessionStr = JSON.stringify(session);
    localStorage.setItem('session', sessionStr);
    setSession(session);
  };

  return (
    <AuthContext.Provider value={{ session, persistSession }}>
      {children}
    </AuthContext.Provider>
  );
};
