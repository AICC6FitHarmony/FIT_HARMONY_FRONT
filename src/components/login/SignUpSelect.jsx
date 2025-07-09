import React from 'react'
import { Link } from 'react-router-dom'
import trainerImage from './source/trainer_image.png';
import personImage from './source/person_image.png';
const SignUpSelect = () => {

  

  return (
    <div className='mx-auto w-1/3 min-w-[400px] bg-white px-8 py-4 shadow-md shadow-green-800/10'>
      <h2 className='text-3xl font-bold text-center py-2 pb-5'>회원 구분</h2>
      <div className='flex'>
        <Link to={"person"} className='w-1/2 rounded-lg hover:bg-green-100 transition-all duration-300'>
          <div className='p-1 text-center'>
            <div className='rounded-sm overflow-hidden h-[10rem]'>
              <img src={personImage} alt="personImage" className='w-full'/>
            </div>
            <p className='text-lg font-bold'>일반 회원</p>
          </div>
        </Link>
        <Link to={"trainer"} className='w-1/2 rounded-lg hover:bg-green-100 transition-all duration-300'>
        <div className='p-1 text-center'>
            <div className='overflow-hidden h-[10rem]'>
              <img src={trainerImage} alt="trainerImage" className='w-full' />
            </div>
            <p className='text-lg font-bold'>강사 회원</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default SignUpSelect
