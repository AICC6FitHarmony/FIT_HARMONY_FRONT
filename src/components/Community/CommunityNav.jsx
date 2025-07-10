import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getBoards, getFilteredBoards } from '../../js/community/communityUtils';
import { useAuth } from '../../js/login/AuthContext';
import { SettingsIcon } from 'lucide-react';

const CommunityNav = ({}) => {
  const {user, loading} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [boards, setBoards] = useState([]);
  
  useEffect(()=>{
    // console.log(user)
    if(loading) return;
    const role = user.loggedIn?user.user.role:"OTHERS";
    const update = async()=>{
      const result = await getFilteredBoards(role,"read");
      setBoards(result.boards);
      // console.log(result);
    }
    update();
  },[loading])

  return (
  <div>
    <div className='flex items-center justify-between'>
      <div className='board_title cursor-pointer text-2xl p-5 font-bold text-[#4a902c]'
        onClick={()=>navigate(`/community/`,{replace:true})}
        >커뮤니티</div>
      {
        (user?.user?.role === "ADMIN")&&(
          <div className='cursor-pointer p-2 flex gap-1' onClick={()=>navigate('/community/admin')}>
            관리자 페이지
            <SettingsIcon />
          </div>
        )
      }
    </div>
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
  )
}

export default CommunityNav
