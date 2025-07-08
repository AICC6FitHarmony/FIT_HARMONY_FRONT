import React, { useEffect, useState } from 'react'
import { Link, redirect, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { AuthProvider, useAuth, useAuthRedirect } from '../../js/login/AuthContext'
import StandardModal from '../cmmn/StandardModal';
import CommunityBoard from './CommunityBoard';
import CommunityPostEdit from './CommunityPostEdit';
import PostView from './PostView';
import CommunityPostUpdate from './CommunityPostUpdate';
import { getBoards } from '../../js/community/communityUtils';

const Community = () => {
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(()=>{
    const update = async ()=>{
      const res = await getBoards();
      console.log(res.data.boards)
      setBoards(res.data.boards);
    }
    update();
  },[]);

  return (
      <div>
        <div className="header">
          <div className='board_title cursor-pointer text-2xl p-5 font-bold text-[#4a902c]'
            onClick={()=>navigate(`/community/`,{replace:true})}
            >커뮤니티</div>
          <div className='nav flex gap-4 py-2 pl-5'>
            <div onClick={()=>navigate(`/community/`,{replace:true})} className='cursor-pointer relative'>
              전체
              {
                location.pathname == "/community/"&&(
                  <div className='absolute w-full h-[1px] bg-black' />
                )
              }
            </div>
            {
              boards&&(
                boards.map((item,idx)=>(
                  <div key={item.categoryId} onClick={()=>navigate(`/community/${item.categoryId}`,{replace:true})} className='cursor-pointer relative'>
                    {item.categoryName}
                    {
                      location.pathname == `/community/${item.categoryId}`&&(
                        <div className='absolute w-full h-[1px] bg-black' />
                      )
                    }
                  </div>
                ))
              )
            }
          </div>
        </div>
        <Routes>
          <Route path='/' element={<CommunityBoard/>}/>
          <Route path='/:boardId' element={<CommunityBoard/>}/>
          <Route path='/:boardId/create' element={<CommunityPostEdit boards={boards}/>}/>
          <Route path='/:postId/update' element={<CommunityPostUpdate  boards={boards}/>}/>
          <Route path='/post/:postId' element={<PostView/>}/>
        </Routes>
      </div>
  )
}

export default Community
