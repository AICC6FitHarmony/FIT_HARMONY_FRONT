import React from 'react'
import { deleteComment } from '../../../js/community/comunityUtils';

const Comment = ({load_comments, comment, auth_id}) => {
  const {nickName, content, createdTime, userId, commentId} = comment;
  // console.log(auth_id)
  const handleDelete = async()=>{
    const res = await deleteComment({
      userId:auth_id, commentId
    });
    console.log(res);
    load_comments();
  }

  return (
    <div className='flex p-2 justify-between items-center relative'>
      <div className='header w-[calc(100%-9rem)] flex items-center justify-start'>
        <div className='text-center min-w-[5rem]'>
          {nickName}
        </div>
        <div className='w-[calc(100%-5rem)] px-2'>
          {content}
        </div>
      </div>
      <div className="footer flex gap-1 min-w-[9rem]">
        <div className='info flex flex-col items-center justify-center min-w-[6.5rem]'>
          <div>{createdTime.substr(0,10)}</div>
          <div>{createdTime.substr(11,8)}</div>
        </div>
        <div className="nav flex flex-col gap-0.5 min-w-[2.5rem]">
          {
            auth_id&&<div className='cursor-pointer px-1 rounded-sm border'>답글</div>
          }
          {(auth_id === userId)?(
            <div onClick={handleDelete} className='cursor-pointer px-1 rounded-sm border'>삭제</div>
          ):""}
        </div>
      </div>
      <div className='absolute w-[95%] border-b bottom-0 left-[50%] translate-x-[-50%]'/>
    </div>
  )
}

export default Comment
