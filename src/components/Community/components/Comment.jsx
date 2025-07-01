import React, { useState } from 'react'
import { deleteComment, updateComment } from '../../../js/community/comunityUtils';

const Comment = ({load_comments, comment, auth_id, handleReply}) => {
  const {nickName, content, createdTime, userId, commentId,isDeleted} = comment;
  const [editComment, setEditComment] = useState(false);
  const [editContent, setContent] = useState(content);
  const handleDelete = async()=>{
    const res = await deleteComment({
      userId:auth_id, commentId
    });
    console.log(res);
    load_comments();
  }

  const handleUpdate = async()=>{
    const res = await updateComment({
      userId:auth_id, commentId, content:editContent
    })
    console.log(res)
    load_comments();
    setEditComment(false);
  }

  const updateEditor = ()=>{
    setEditComment(!editComment)
  }

  const handleChange = (e)=>{
    setContent(e.target.value);
  }
  return (
    <div className='p-2 relative'>
      <div className="header flex justify-between">
        <div className="nick-name font-bold">{nickName}</div>
        <div className="nav">
          {(auth_id === userId && isDeleted === false)?(
              <div className='flex gap-1.5'>
                <div onClick={updateEditor} className='cursor-pointer px-1 rounded-sm border'>수정</div>
                <div onClick={handleDelete} className='cursor-pointer px-1 rounded-sm border'>삭제</div>
              </div>
          ):""}
        </div>
      </div>
      {
        editComment
        ?(
          <div className='py-2 flex gap-2'>
            <textarea name="" id="" rows={3} value={editContent} onChange={handleChange} className='w-[calc(100%-100px)] bg-white border p-2'></textarea>
            <div className='cursor-pointer border px-3 flex justify-center items-center' onClick={handleUpdate}>댓글 수정</div>
          </div>
        )
        :(<div className="body pl-1">
            {isDeleted?"삭제된 댓글 입니다.":content}
          </div>)
      }
      <div className="footer">
          <div className="date text-neutral-500 text-sm">{createdTime.substr(0,10)} {createdTime.substr(11,8)}</div>
          <div className="btn">
            {
             (auth_id && isDeleted === false)&&<div onClick={handleReply} className='cursor-pointer px-1 rounded-sm border w-fit'>답글</div>
            }
          </div>
      </div>
      <div className='absolute w-[95%] border-b bottom-0 left-[50%] translate-x-[-50%]'/>
    </div>
  )
}

export default Comment
