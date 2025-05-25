import { Session } from '@supabase/supabase-js';
import React, { createContext, useEffect, useState } from 'react';
import { supabase } from 'utils/supabase';
export type { Session };

interface AuthContextProps {
  session: Session | null;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  session: null,
  logout: () => null,
});

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);

  const logout = async () => {
    localStorage.removeItem('activities');
    await supabase.auth.signOut({ scope: 'local' });
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

  return (
    <AuthContext
      value={{
        session,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
};
