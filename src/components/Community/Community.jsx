import React from 'react'
import { Link, redirect, Route, Routes } from 'react-router-dom';

import { AuthProvider, useAuthRedirect } from '../../js/login/AuthContext'
import StandardModal from '../cmmn/StandardModal';
import CommunityBoard from './CommunityBoard';
import CommunityPostEdit from './CommunityPostEdit';
import PostView from './PostView';

const Community = () => {


  // const { user, loading } = useAuthRedirect();
  // console.log("User : ",user);
  // console.log(loading);
  return (
      <div>
        <Routes>
          <Route path='/' element={<CommunityBoard/>}/>
          <Route path='/:boardId' element={<CommunityBoard/>}/>
          <Route path='/:boardId/create' element={<CommunityPostEdit/>}/>
          <Route path='/post/:postId' element={<PostView/>}/>
        </Routes>
      </div>
  )
}

export default Community
