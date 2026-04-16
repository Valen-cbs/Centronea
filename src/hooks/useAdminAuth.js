import { useEffect, useState } from 'react';
import { getAdminSession, isAdminAuthenticated, loginAdmin, logoutAdmin } from '../lib/adminAuth.js';

export function useAdminAuth() {
  const [session, setSession] = useState(() => getAdminSession());

  useEffect(() => {
    const syncAuthState = () => {
      setSession(getAdminSession());
    };

    window.addEventListener('storage', syncAuthState);

    return () => {
      window.removeEventListener('storage', syncAuthState);
    };
  }, []);

  const login = (username, password) => {
    const result = loginAdmin(username, password);

    if (result.ok) {
      setSession(getAdminSession());
    }

    return result;
  };

  const logout = () => {
    logoutAdmin();
    setSession(null);
  };

  return {
    session,
    isAuthenticated: isAdminAuthenticated(),
    login,
    logout,
  };
}
