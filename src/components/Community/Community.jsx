import React, { useEffect, useState } from 'react'
import { Link, redirect, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { AuthProvider, useAuth, useAuthRedirect } from '../../js/login/AuthContext'
import CommunityBoard from './CommunityBoard';
import CommunityPostEdit from './CommunityPostEdit';
import PostView from './PostView';
import CommunityPostUpdate from './CommunityPostUpdate';
import { getBoards } from '../../js/community/communityUtils';
import CommunityAdmin from './CommunityAdmin';
import CommunityNav from './CommunityNav';

const Community = () => {
  const [boards, setBoards] = useState([]);
  const update = async ()=>{
    const res = await getBoards();
    console.log(res.data.boards)
    setBoards(res.data.boards);
  }
  useEffect(()=>{
    update();
  },[]);
  return (
      <div>
        <div className="header">
          <Routes>
            <Route path='/admin'/>
            <Route path='/*' element={<CommunityNav boards={boards}/>}/>
          </Routes>
        </div>
        <Routes>
          <Route path='/' element={<CommunityBoard boards={boards}/>}/>
          <Route path='/admin' element={<CommunityAdmin boards={boards} updateBoards={update}/>}/>
          <Route path='/:boardId' element={<CommunityBoard boards={boards}/>}/>
          <Route path='/:boardId/create' element={<CommunityPostEdit boards={boards}/>}/>
          <Route path='/:postId/update' element={<CommunityPostUpdate  boards={boards}/>}/>
          <Route path='/post/:postId' element={<PostView/>}/>
        </Routes>
      </div>
  )
}

export default Community