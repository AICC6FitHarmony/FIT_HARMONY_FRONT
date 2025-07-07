import React from 'react'
import googleLogo from '../googleIcon.png'

const SignButton = ({handleSubmit}) => {
  return (
    <div onClick={handleSubmit} className='text-lg cursor-pointer select-none py-2 w-2/3 rounded-sm bg-[#4285F4] text-neutral-100 text-center flex items-center px-2 gap-4'>
        <div className='w-10 h-10 p-1 bg-white rounded-sm'>
          <img src={googleLogo} alt="" />
        </div>
        <div className='w-auto text-center'>
          Google 계정으로 회원 가입
        </div>
    </div>
  )
}

export default SignButton
