import React, { createContext, useState, ReactNode, useEffect } from 'react';

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
  persistSession: (_session: Session) => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session') || 'null');
    if (session) {
      setSession(session);
    }
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
