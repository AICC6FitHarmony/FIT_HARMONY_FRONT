import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getComments } from '../../../js/community/comunityUtils';
import CommentInput from './CommentInput';

const CommentsView = () => {
  const {postId} = useParams();
  const [comments, setComments] = useState([]);

  useEffect(()=>{
    getComments(postId,setComments)
  },[]);



  return (
    <div className='border min-h-[200px]'>
      <div className="header flex justify-between p-2">
        <div>comment</div>
        <div>{comments.length}</div>
      </div>
      <div className="body">
        <div className="list">

        </div>
        <CommentInput/>
      </div>
    </div>
  )
}

export default CommentsView
