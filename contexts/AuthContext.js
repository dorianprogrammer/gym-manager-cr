"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthChange, logoutAdmin } from "../lib/auth";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthChange((authData) => {
      setAuthState({
        ...authData,
        loading: false,
      });
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    const result = await logoutAdmin();
    if (result.success) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
    return result;
  };

  const value = {
    ...authState,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
