import React, { useRef, useState } from 'react'
import DaumPostcode from "react-daum-postcode";
import StandardModal from '../../cmmn/StandardModal';
import GymSelector from './GymSelector';


const SignGym = () => {

  return (
    <div className='pb-10'>
      <div className='text-2xl font-bold text-center pb-5'>
        소속 선택
      </div>
      <GymSelector/>
    </div>
  )
}

export default SignGym
