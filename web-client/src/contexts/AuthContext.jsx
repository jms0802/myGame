import React, { createContext, useContext, useState, useEffect } from "react";
import { useGuestUID } from "../hooks/useGuestUID";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { user: guestUser, refreshUser } = useGuestUID();
  const [user, setUser] = useState(guestUser);

  useEffect(() => {
    setUser(guestUser);
  }, [guestUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 