import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getComments } from '../../../js/community/comunityUtils';
import CommentInput from './CommentInput';
import Comment from './Comment';
import { useAuth } from '../../../js/login/AuthContext';


const CommentsView = () => {
  const {postId} = useParams();
  const [comments, setComments] = useState([]);
  const {user, loading} = useAuth();
  const [userId, setUserId] = useState("");

  useEffect(()=>{
    if (loading == false &&user.isLoggedIn){
      setUserId(user.user.userId);
    }
  },[loading]);
  const loadComments = ()=>{
    getComments(postId, setComments)
  }

  useEffect(()=>{
    loadComments();
  },[]);


  return (
    <div className='border min-h-[200px]'>
      <div className="header flex justify-between p-2">
        <div>comment</div>
        <div>{comments.length}</div>
      </div>
      <div className="body">
        <div className="list py-2">
          {
            comments?.map((comment, idx)=>(
              <Comment key={idx} comment={comment} load_comments={loadComments} auth_id={userId}/>
            ))
          }
        </div>
        <CommentInput load_comments={loadComments}/>
      </div>
    </div>
  )
}

export default CommentsView
