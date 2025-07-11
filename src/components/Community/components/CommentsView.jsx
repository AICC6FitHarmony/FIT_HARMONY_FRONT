import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getComments } from '../../../js/community/communityUtils';
import CommentInput from './CommentInput';
import Comment from './Comment';
import { useAuth } from '../../../js/login/AuthContext';


const CommentsView = () => {
  const {postId} = useParams();
  const [comments, setComments] = useState([]);
  const {user, loading} = useAuth();
  const [userId, setUserId] = useState("");
  const [page, setPage] = useState(1);

  const [replyId, setReplyId] = useState(0)

  useEffect(()=>{
    if (loading == false &&user.isLoggedIn){
      setUserId(user.user.userId);
    }
  },[loading]);
  const loadComments = async ()=>{
    await getComments(postId, setComments);
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
    <div className='border-green-700 rounded-xl min-h-[200px]'>
      <div className="header flex justify-between p-2 rounded-sm items-center text-[#a0e881] bg-[#82b16c]">
        <div>comment</div>
        <div>{comments.length}</div>
      </div>
      <div className="body">
        <div className="list">
          {
            comments?.map((comment, idx)=>(
              <div key={comment.commentId} style={
                {
                  paddingLeft:`${30*((comment.depth-1))}px`
                }
              }>
                <Comment comment={comment} load_comments={loadComments} auth_id={userId} handleReply={handleReply(comment.commentId)}/>
                  {
                    (replyId===comment.commentId)?(
                      <div className='pl-[30px] py-6'>
                        <CommentInput load_comments={loadComments} parent_comment_id={comment.commentId} title={"답글 작성"}/>
                      </div>
                    ):""
                  }
              </div>
            ))
          }
        </div>
        <div className='pt-10'>
        {
          (replyId === 0)
          ?(
            <CommentInput load_comments={loadComments}/>
          )
          :(
            <div className='w-full bg-white p-4 pt-6 rounded-xl shadow-xl'>
              <div onClick={handleReply(0)}
              className='w-full bg-[#82b16c] text-emerald-100 border px-2 py-2 text-center rounded-sm cursor-pointer'>댓글 작성하기</div>
            </div>
          )
        }
        </div>
        
      </div>
    </div>
  )
}

export default CommentsView
