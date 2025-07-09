import React, { useRef, useState } from 'react'
import GymSelector from './GymSelector';


const SignGym = ({onChange}) => {
  const handleSelect = ({gymId})=>{
    onChange({target:{name:"gymId", value:gymId}})
  }
  return (
    <div className='pb-10'>
      <GymSelector setSelect={handleSelect}/>
    </div>
  )
}

export default SignGym
