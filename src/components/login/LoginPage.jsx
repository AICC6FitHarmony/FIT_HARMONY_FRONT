import React from 'react'
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import googleLogo from './googleIcon.png'
import kakaoLogo from './kakao.svg'
import { googleLogin, userLogout } from '../../js/login/loginUtils';
const LoginPage = ({loginFail}) => {



  const kakaoLogin = () => {
    toast.info("카카오 로그인으로 이동합니다.", {
      position: "bottom-center"
    });
    // location.href = `${import.meta.env.VITE_BACKEND_DOMAIN}/auth/google`;
  }
  const btnStyle = "text-xl";
  return (
    <>
      <div className='flex flex-col gap-1 p-2 h-fit w-1/3 min-w-[300px] shadow-green-800/10 shadow-md bg-white px-6 rounded-lg'>
          <div className='text-3xl font-bold text-center py-4'>
            Login
          </div>
          <div onClick={googleLogin} className='cursor-pointer select-none text-xl py-2 w-full rounded-sm bg-[#4285F4] text-neutral-100 text-center flex items-center px-2 gap-4'>
            <div className='w-10 h-10 p-1 bg-white rounded-sm'>
              <img src={googleLogo} alt="" />
            </div>
            <div className='w-auto text-center'>
              Google 로그인
            </div>
          </div>
          {/* <div className='text-xl py-2 w-full rounded-sm bg-yellow-300 text-center flex items-center px-2 gap-4'>
            <div className='w-10 h-10 p-1'>
              <img src={kakaoLogo} alt="" />
            </div>
            <div className='w-auto text-center'>
              카카오 로그인
            </div>
          </div> */}
          <div className='text-lg flex justify-center font-light'>
            아직 회원이 아니시라면 &nbsp;
            <Link to="/login/signup">
            <div className='underline text-green-700 font-bold'>
              회원가입
            </div>
            </Link>
            {/* <button onClick={()=>{userLogout()}}>로그아웃</button> */}
          </div>
      </div>
      <ToastContainer/>
    </>
  )
}

export default LoginPage
