import React from 'react'
import { Link } from 'react-router-dom'

const SignUpSelect = () => {


  return (
    <div className='mx-auto x-1/2'>
      <h2 className='text-4xl'>회원 구분</h2>
      <div className='flex'>
        <Link to={"person"}>
          <div className='p-1 text-center'>
            <div className='w-[200px] h-[160px] border'>

            </div>
            <p>일반 회원</p>
          </div>
        </Link>
        <Link to={"trainer"}>
        <div className='p-1 text-center'>
            <div className='w-[200px] h-[160px] border'>

            </div>
            <p>강사 회원</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default SignUpSelect
