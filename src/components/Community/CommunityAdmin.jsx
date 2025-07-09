import React, { useEffect, useState } from 'react'
import ListSelector from '../cmmn/ListSelector';
const CommunityAdmin = ({boards, updateBoards}) => {

  const handleBoardSelect = async ({item,idx})=>{
    console.log(item);
  }

  return (
    <div className='px-4 pt-[3rem]'>
      <div className='header'>
        <div className='text-3xl pb-4'>
          관리 페이지
        </div>
      </div>
      <div className='body border p-5 flex justify-between'>
        <div className='min-w-[20rem] w-1/4 h-[25rem] p-3'>
          <div className="border">
            <div>
            <ListSelector
              list={boards}
              onSelect={handleBoardSelect}
              Template={({item})=>(
                <div className='pl-5 py-1'>
                  {item.categoryName}
                </div>
              )}
            />
            </div>
            <div className='flex justify-between h-[1rem]'>
              <div className='bg-white w-1/2 text-center'>추가</div>
            </div>
          </div>
        </div>
        <div className='setting-wrapper w-3/4 p-3'>
          <div className='w-full h-full border'>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityAdmin
