import { Session } from '@supabase/supabase-js';
import React, { createContext, useEffect, useState } from 'react';
import { supabase } from 'utils/supabase';
export type { Session };

interface AuthContextProps {
  session: Session | null;
  logout: () => void;
  setSession: (session: Session) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  session: null,
  logout: () => null,
  setSession: () => null,
});

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);

  const logout = async () => {
    localStorage.removeItem('activities');
    await supabase.auth.signOut({ scope: 'local' });
    // window.location.reload();
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => subscription.unsubscribe();
  }, []);

  const localSetSession = (session: Session | null) => {
    // TODO remove
    console.log('not neede anymore');
  };

  return (
    <AuthContext
      value={{
        session,
        logout,
        setSession: localSetSession,
      }}
    >
      {children}
    </AuthContext>
  );
};
