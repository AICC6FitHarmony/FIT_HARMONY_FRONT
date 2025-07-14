import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { findComment, getComments } from '../../../js/community/communityUtils';
import CommentInput from './CommentInput';
import Comment from './Comment';
import { useAuth } from '../../../js/login/AuthContext';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';


const CommentsView = () => {
  const {postId} = useParams();
  const [comments, setComments] = useState([]);
  const {user, loading} = useAuth();
  const [userId, setUserId] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [focusComment, setFocusComment] = useState(-1);
  const [replyId, setReplyId] = useState(0)
  const navigate = useNavigate();
  const updateComment = async ()=>{
    const res = await getComments(postId,page);
    setComments(res.data.comments);
    setPageCount(res.data.pageCount);
  }

  console.log(pageCount);

  useEffect(()=>{
    if (loading == false &&user.isLoggedIn){
      setUserId(user.user.userId);
    }
  },[loading]);
  const loadComments = async ()=>{
    await updateComment();
    await setReplyId(0);
  }

  useEffect(()=>{
    loadComments();
  },[]);
  useEffect(()=>{
    const pageUpdate = async ()=>{
      await loadComments();
      if(focusComment < 1) return;
      setTimeout(() => {
        handleScroll(focusComment);
      }, 100);
    }
    pageUpdate();
  },[page]);

  const handleReply = (commentId) => ()=>{
    if (commentId === replyId) setReplyId(0);
    else setReplyId(commentId);
  }

  const handleClickPage = (idx) => ()=>{
    setPage(idx);
  }

  const handleScroll = (commentId)=>{
    const el = document.getElementById(`comment-${commentId}`);
    if(!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: y - 200, behavior: "smooth" });
    return;

    if (el) {
      el.scrollIntoView({ behavior: "smooth"});
    }
  }

  const handleFocusComment = async (commentId)=>{
    
    setFocusComment(commentId);
    for(let i = 0; i < comments.length ; i++){
      if(comments[i].commentId === commentId){
        console.log(comments[i]);
        handleScroll(commentId);
        return;
      }
    }

    const res = await findComment(postId, commentId);

    console.log("res?.data?.pageCount", res);
    setPage(res.page);
  };

  return (
    <div className='border-green-700 rounded-xl min-h-[200px]'>
      <div className="header flex justify-between p-2 rounded-sm items-center text-[#a0e881] bg-[#82b16c]">
        <div>comment</div>
        <div>{comments.length}</div>
      </div>
      <div className="body">
        <div className="list overflow-hidden">
          {
            comments?.map((comment, idx)=>(
              <div  
                id={`comment-${comment.commentId}`} 
                key={comment.commentId} 
                style={
                {
                  paddingLeft:`${20*((comment.depth-1))}px`
                }
              }>
                <Comment 
                  comment={comment} 
                  load_comments={loadComments} 
                  auth_id={userId} 
                  handleReply={handleReply(comment.commentId)} 
                  focusParent={handleFocusComment}
                  isFocus={focusComment===comment.commentId}
                />
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
        {(comments.length > 0)&&(<div className='page-nav  p-2 rounded-sm flex items-center justify-center text-emerald-100 bg-[#82b16c]'>
          <div className='flex justify-center gap-2 w-[20rem]'>
            <div className='w-[2rem] flex justify-center items-center'>
              {
              (page>1)&&(<ArrowLeftIcon className='cursor-pointer' onClick={handleClickPage(page-1)}/>)
              }
            </div>
            {
              [...Array(pageCount)].map((item,idx)=>{
                return(<div key={idx} className={`cursor-pointer ${idx+1 === page ?"font-bold underline":""}`} onClick={handleClickPage(idx+1)}>{idx+1}</div>)
              })
            }
            <div className='w-[2rem] flex justify-center items-center'>
              {
              (page<pageCount)&&(<ArrowRightIcon className='cursor-pointer' onClick={handleClickPage(page+1)}/>)
              }
            </div>
          </div>
        </div>)}
        <div className=''>
        {
          (replyId === 0 && userId)
          ?(
            <CommentInput load_comments={loadComments}/>
            )
          :(
            <div className='w-full bg-white p-4 pt-6 rounded-xl shadow-xl'>
              {
                userId
                ?(
                  <div 
                  onClick={handleReply(0)}
                  className='w-full bg-[#82b16c] text-emerald-100 border px-2 py-2 text-center rounded-sm cursor-pointer'>
                    댓글 작성하기
                  </div>
                )
                :(
                  <div 
                  onClick={()=>navigate('/login')}
                  className='w-full bg-[#82b16c] text-emerald-100 border px-2 py-2 text-center rounded-sm cursor-pointer'>
                    회원만 댓글 작성이 가능합니다.
                  </div>
                )
              }
            </div>
          )
        }
        </div>
      </div>
    </div>
  )
}

export default CommentsView