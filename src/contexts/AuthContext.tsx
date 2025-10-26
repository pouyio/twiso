import { Session } from '@supabase/supabase-js';
import React, { createContext, useEffect, useState } from 'react';
import { removeUserActivities } from 'utils/cache';
import db, { USER_MOVIES_TABLE, USER_SHOWS_TABLE } from 'utils/db';
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
  const [session, setSession] = useState<Session | null>(
    JSON.parse(
      localStorage.getItem(`sb-${process.env.VITE_SUPABASE_DB}-auth-token`) ||
        'null'
    )
  );

  const logout = async () => {
    removeUserActivities();
    await supabase.auth.signOut({ scope: 'local' });
    db[USER_SHOWS_TABLE].clear();
    db[USER_MOVIES_TABLE].clear();
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
