import React from 'react'
import { Link, redirect, Route, Routes } from 'react-router-dom';

import { AuthProvider, useAuth, useAuthRedirect } from '../../js/login/AuthContext'
import StandardModal from '../cmmn/StandardModal';
import CommunityBoard from './CommunityBoard';
import CommunityPostEdit from './CommunityPostEdit';
import PostView from './PostView';
import CommunityPostUpdate from './CommunityPostUpdate';

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
          <Route path='/:postId/update' element={<CommunityPostUpdate/>}/>
          <Route path='/post/:postId' element={<PostView/>}/>
        </Routes>
      </div>
  )
}

export default Community
