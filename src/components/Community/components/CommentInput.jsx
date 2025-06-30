import React, { useState } from 'react'
import { useParams } from 'react-router-dom';

const CommentInput = ({parent_comment}) => {
  const {postId} = useParams();
  const [content, setContent] = useState("");

  if(!parent_comment) parent_comment= null;

  const handleChange = (e)=>{
    setContent(e.target.value);
  }

  const handleCreate = async()=>{
    const body = {
      postId, parent_comment, content
    }
    console.log(body)
  }
  return (
        <div className="input p-1 border">
          <div>댓글 작성</div>
          <div className='flex gap-2 p-1'>
            <textarea onChange={handleChange} className='border w-[calc(100%-100px)] bg-white p-2' name="" id="" rows={3}></textarea>
            <div className='cursor-pointer border px-3 flex justify-center items-center' onClick={handleCreate}>댓글 작성</div>
          </div>
        </div>
  )
}

export default CommentInput
