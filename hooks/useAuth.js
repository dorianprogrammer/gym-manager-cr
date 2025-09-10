"use client";

import { useState, useEffect } from "react";
import { onAuthChange } from "../lib/auth";

export function useAuth() {
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

  return authState;
}
