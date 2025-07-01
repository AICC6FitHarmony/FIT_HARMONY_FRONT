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

  const [replyId, setReplyId] = useState(0)

  useEffect(()=>{
    if (loading == false &&user.isLoggedIn){
      setUserId(user.user.userId);
    }
  },[loading]);
  const loadComments = ()=>{
    getComments(postId, setComments);
    setReplyId(0);
  }

  useEffect(()=>{
    loadComments();
  },[]);

  const handleReply = (commentId) => ()=>{
    if (commentId === replyId) setReplyId(0);
    else setReplyId(commentId);
  }

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
              <div key={idx} style={
                {
                  paddingLeft:`${30*(comment.depth-1)}px`
                }
              }>
                <Comment comment={comment} load_comments={loadComments} auth_id={userId} handleReply={handleReply(comment.commentId)}/>
                  {
                    (replyId===comment.commentId)?(
                      <div className='pl-[30px]'>
                        <CommentInput load_comments={loadComments} parent_comment_id={comment.commentId}/>
                      </div>
                    ):""
                  }
              </div>
            ))
          }
        </div>
        {
          (replyId === 0)
          ?(
            <CommentInput load_comments={loadComments}/>
          )
          :(
            <div className='w-full p-2'>
              <div onClick={handleReply(0)} className='w-full bg-white border px-2 py-4 text-center rounded-sm cursor-pointer'>댓글 작성하기</div>
            </div>
          )
        }
        
      </div>
    </div>
  )
}

export default CommentsView
