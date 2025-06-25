import React, { useState } from 'react'

const SignBodyPage = ({userInfo, setUserInfo, handleChangeValue, handleInputNumber}) => {
  const {age, height, weight} = userInfo;
  const ageRangeOut = age < 5 || age > 100;

  return (
    <div className={'flex justify-center flex-col items-center gap-5'}>
      <div className="age w-full flex gap-2 items-center justify-between relative">
        <div>나이</div>
        <div className='w-[80%] flex flex-col'>
          <input name='age' onChange={handleInputNumber} className={'text-center border py-2 w-full '+`${ageRangeOut?'border-red-500':''}`} value={age?age:""} type="text"/>
          {
            ageRangeOut?(
              <p className='text-sm text-red-500 absolute bottom-[-17px]'>나이를 확인해 주세요(5~100)</p>
            ):''
          }
        </div>
      </div>
      <div className="height w-full flex gap-2 items-center justify-between">
        <div>키</div>
        <input name='height' onChange={handleInputNumber} className='text-center border py-2 w-[80%]' value={height?height:""} type="text"/>
      </div>
      <div className="weight w-full flex gap-2 items-center justify-between">
        <div>몸무게</div>
        <input name='weight' onChange={handleInputNumber} className='text-center border py-2 w-[80%]' value={weight?weight:""} type="text"/>
      </div>
      <div className='gender flex w-full gap-2 items-center justify-between'>
        <div>성별</div>
        <div className='flex text-center justify-center py-2 w-[80%] items-center'>
          <div className='w-1/2'>
            <span>남</span>
            <input type="radio" onChange={handleChangeValue} defaultChecked={true} value='M' name='gender'/>
          </div>
          <div className='w-1/2 items-center'>
            <span>여</span>
            <input type="radio" onSelect={handleChangeValue} onChange={handleChangeValue} value='F' name='gender'/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignBodyPage
