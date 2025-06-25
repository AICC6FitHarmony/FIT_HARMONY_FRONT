import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);        // 사용자 정보
  const [loading, setLoading] = useState(true);  // 로딩 상태
  useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_DOMAIN+"/login/check-auth", {
      credentials: 'include' // 세션 쿠키 전달
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);