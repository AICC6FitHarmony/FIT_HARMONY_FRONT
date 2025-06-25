import React from 'react'
import { AuthProvider, useAuth } from '../../js/login/AuthContext'

const Community = () => {
  const { user, loading } = useAuth();
  console.log("User : ",user);
  console.log(loading);
  return (
      <div className=''>
        123123
      </div>
  )
}

export default Community
