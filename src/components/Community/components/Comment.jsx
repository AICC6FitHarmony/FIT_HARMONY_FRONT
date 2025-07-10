import React, { useState } from 'react'
import { deleteComment, updateComment } from '../../../js/community/communityUtils';
import { CornerDownRight } from 'lucide-react';

const Comment = ({load_comments, comment, auth_id, handleReply, focusParent}) => {
  const {nickName, content, createdTime, userId, commentId,isDeleted, depth} = comment;
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
    await load_comments();
    setEditComment(false);
  }

  const updateEditor = ()=>{
    setEditComment(!editComment)
  }

  const handleChange = (e)=>{
    setContent(e.target.value);
  }
  return (
    <div className={`p-2 relative rounded-xl shadow-xl mt-0.5 ${isDeleted?"bg-gray-100":"bg-white"}`}>
      <div className="header flex justify-between">
        <div className="nick-name font-bold text-green-700 flex">
          {(depth>1)?(<CornerDownRight/>):""}
          <span>{nickName}</span>
        </div>
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
            <textarea name="" id="" rows={3} value={editContent} onChange={handleChange} className='w-[calc(100%-100px)] bg-neutral-100 border p-2'></textarea>
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
      {/* <div className='absolute w-[100%] border-b bottom-0 left-0'/>
      <div className='absolute w-[100%] border-b top-[-1px] left-0'/> */}
      
      {/* {(depth>1)?(<div className='absolute rounded-2xl h-full border-l bottom-0 left-0'/>):""} */}
    </div>
  )
}

export default Comment
