import React, { useRef, useState } from 'react'
import DaumPostcode from "react-daum-postcode";
import StandardModal from '../../cmmn/StandardModal';
import GymSelector from './GymSelector';


const SignGym = ({onChange}) => {
  const handleSelect = ({gymId})=>{
    onChange({target:{name:"gymId", value:gymId}})
  }
  return (
    <div className='pb-10'>
      <div className='text-2xl font-bold text-center pb-5'>
        소속 선택
      </div>
      <GymSelector setSelect={handleSelect}/>
    </div>
  )
}

export default SignGym
