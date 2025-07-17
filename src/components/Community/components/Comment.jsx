import React, { useState } from 'react'
import { deleteComment, findComment, updateComment } from '../../../js/community/communityUtils';
import { CornerDownRight } from 'lucide-react';
import { useAlertModal, useModal } from '../../cmmn/ModalContext';

const Comment = ({load_comments, comment, auth_id, handleReply, focusParent,isFocus, onClick}) => {
  const {nickName, content, createdTime, userId, commentId,isDeleted, depth} = comment;
  const [editComment, setEditComment] = useState(false);
  const [editContent, setContent] = useState(content);
  const openModal = useModal();
  const openAlert = useAlertModal();
  const handleDelete = async()=>{
    const deleteEvent = async ()=>{
      const res = await deleteComment({
        userId:auth_id, commentId
      });
      console.log(res);
      if(res.success)
        return load_comments(-1);
      openAlert({
        title:"작업이 완료되지 않음",
        text:"권한이 없습니다. 로그인을 확인해 주세요."
      })
    }

    openModal({
      title:"댓글 삭제",
      children:(<div>댓글을 삭제하시겠습니까?</div>),
      okEvent:()=>deleteEvent(),
      isOkClose:true,
      isCancelClose:true,
      size:{width:"auto", height:"auto"}
    })
  }

  const handleUpdate = async()=>{
    const res = await updateComment({
      userId:auth_id, commentId, content:editContent
    })
    console.log(res)
    if(res.success){
      await load_comments();
      setEditComment(false);
      return;
    }
    openAlert({
      title:"작업이 완료되지 않음",
      text:"권한이 없습니다. 로그인을 확인해 주세요."
    })
  }

  const updateEditor = ()=>{
    setEditComment(!editComment)
  }

  const handleChange = (e)=>{
    setContent(e.target.value);
  }

  const handleFindParent =  (e)=>{
    focusParent(comment.parentCommentId);
    e.preventDefault();
    
  }

  return (
    <div className={`p-2 relative rounded-xl shadow-xl mt-0.5 overflow-hidden ${isDeleted?"bg-gray-100":"bg-white"}`}>
      <div className="header flex justify-between z-10">
        <div className="nick-name font-bold text-green-700 flex">
          {(depth>1)?(<CornerDownRight className='cursor-pointer' onClick={handleFindParent}/>):""}
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
             (auth_id && isDeleted === false)&&depth<17&&<div onClick={handleReply} className='cursor-pointer px-1 rounded-sm border w-fit'>답글</div>
            }
          </div>
      </div>
      {/* <div className='absolute w-[100%] border-b bottom-0 left-0'/>
      <div className='absolute w-[100%] border-b top-[-1px] left-0'/> */}
      
      {/* {(depth>1)?(<div className='absolute rounded-2xl h-full border-l bottom-0 left-0'/>):""} */}
      {
        isFocus&&(
          <>
          {/* <div className='absolute h-full w-[2px] bottom-0 left-0 bg-green-300'/>
          <div className='absolute h-full w-[2px] bottom-0 right-0 bg-green-300'/> */}
          <div className='absolute h-[2px] w-full top-0 left-0 bg-green-300'/>
          <div className='absolute h-[2px] w-full bottom-0 left-0 bg-green-300'/>
          </>
        )
      }
    </div>
  )
}

export default Comment
