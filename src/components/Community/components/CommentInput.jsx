import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { createComment } from '../../../js/community/comunityUtils';

const CommentInput = ({parent_comment_id, load_comments, title}) => {
  const {postId:post_id} = useParams();
  const [content, setContent] = useState("");


  const handleChange = (e)=>{
    setContent(e.target.value);
  }

  const handleCreate = async()=>{
    const body = {
      post_id, parent_comment_id, content
    }
    const res = await createComment(body);
    load_comments();
    setContent("");
    console.log(res)
  }
  return (
        <div className="input bg-white p-1 rounded-xl shadow-xl">
          <div className='pl-1 py-2 text-green-700 font-bold'>{title?title:"댓글 작성"}</div>
          <div className='flex gap-2 p-1'>
            <textarea onChange={handleChange} value={content} 
            className='border rounded-sm w-[calc(100%-6rem)] bg-neutral-100 p-2' name="" id="" rows={3}></textarea>
            <div className='cursor-pointer rounded-sm border px-3 flex justify-center items-center w-[6rem]' onClick={handleCreate}>작성</div>
          </div>
        </div>
  )
}

export default CommentInput
