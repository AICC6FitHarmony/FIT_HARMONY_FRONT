import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getBoards } from '../../js/community/communityUtils';

const CommunityNav = ({boards}) => {

  const navigate = useNavigate();
  const location = useLocation();
  

  return (
  <div>
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
  )
}

export default CommunityNav
