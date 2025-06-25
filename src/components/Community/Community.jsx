import React from 'react'
import { AuthProvider, useAuthRedirect } from '../../js/login/AuthContext'
import StandardModal from '../cmmn/StandardModal';

const Community = () => {
  const { user, loading } = useAuthRedirect();
  console.log("User : ",user);
  console.log(loading);
  return (
      <div className=''>

        123123
      </div>
  )
}

export default Community
