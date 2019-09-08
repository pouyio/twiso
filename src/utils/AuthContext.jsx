import React, { createContext, useState } from 'react';

const AuthContext = createContext({ session: false });

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(
    JSON.parse(localStorage.getItem('session') || null),
  );

  const persistSession = session => {
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
export default AuthContext;
