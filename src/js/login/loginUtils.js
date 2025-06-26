import { useEffect } from 'react';

//구글 로그인 : 리다이렉트
export const googleLogin = () => {
  location.href = `${import.meta.env.VITE_BACKEND_DOMAIN}/auth/google`;
};

//구글 회원가입
//formData : 회원가입 정보
export const googleRegister = async (formData) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_DOMAIN}/auth/google/register`,
    {
      method: 'POST',
      credentials: 'include',
      // headers: { 'Content-Type': 'multipart/form-data'},
      // body: JSON.stringify(formData)
      body: formData,
    }
  );
  // 2. 직접 리디렉션 (백엔드가 바로 구글로 리디렉션하지 않고 URL만 응답하는 구조)
  const { redirectUrl } = await response.json();
  location.href = redirectUrl;
  return redirectUrl;
};

//로그인 확인 : setUser에 유저 정보 전달
export const loginCheck = (setUser) => {
  useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_DOMAIN + '/login/check-auth', {
      credentials: 'include', // 세션 쿠키 포함
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isLoggedIn) {
          // 로그인 상태
          setUser(data.user);
        } else {
          // 비로그인 상태
          setUser(null);
        }
      });
  }, []);
};

// 유저 로그아웃
// next: 로그아웃 이후 행동 (default = 홈으로 이동)
export const userLogout = (next) => {
  fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/login/logout`, {
    method: 'POST',
    credentials: 'include', // 세션 쿠키 포함!
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data.message); // 'Logged out successfully'
      // 상태 초기화, 페이지 이동 등
      if (next) next();
      else location.href = '/';
    });
};
