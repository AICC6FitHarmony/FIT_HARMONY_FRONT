import React, { createContext, useContext, useEffect, useState } from 'react';
import StandardModal from '../../components/cmmn/StandardModal';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);        // 사용자 정보
  const [loading, setLoading] = useState(true);  // 로딩 상태
  const [isModal, setIsModal] = useState(false);

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

  
  const handleModalOK = ()=>{
    location.href = "/login"
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setIsModal}}>
      {(loading===false&&isModal)?(
        <StandardModal title="로그인 필요" closeEvent={handleModalOK} okEvent={handleModalOK}
        size={{width:"auto", height:"auto"}}>
          로그인이 필요합니다. 로그인페이지로 이동합니다.
        </StandardModal>
      ):''}
      {children}
    </AuthContext.Provider>
  );
};

// 로그인 정보 받기
export const useAuth = () => {
  const {user, loading, setUser} = useContext(AuthContext);
  return {user, loading, setUser};
}

// 로그인 정보 받기, 로그인이 안되어있으면 모달로 알려 준 뒤에 로그인페이지로 이동
export const useAuthRedirect = () => {
  const {user, loading, setIsModal} = useContext(AuthContext);
  useEffect(()=>{
    if(loading===false&&!user || user?.isLoggedIn === false){
      setIsModal(true);
      // location.href = "/login"
    }
  },[loading])
  return {user, loading};
}

