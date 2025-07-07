import React, { useEffect, useState } from 'react'
import { Link, redirect, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getPosts, searchPost, searchQuery } from '../../js/community/communityUtils';
import {NotebookPen} from 'lucide-react'
import { useAuth } from '../../js/login/AuthContext';

const CommunityBoard = () => {
  const {user} = useAuth();
  const {boardId} = useParams();
  const [posts, setPosts] = useState([]);
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");
  const location = useLocation();
  const [keyword, setKeyword] = useState();
  const [keyType, setKeyType] = useState("title");
  const navigate = useNavigate();
  

  useEffect(()=>{
    console.log(location);
    searchPost(
      {
        board_id:boardId,
        query:location.search,
        setPosts
      }
    );
  },[]
  )
  const handleSearch = async ()=>{
    const query = `${searchQuery(
      {
        board_id:boardId,
        page,
        key_type:keyType,
        keyword,
      }
    )}`
    const url = `/community/${query}`
    await navigate(url);
    searchPost(
      {
        board_id:boardId,
        query,
        setPosts
      }
    );
  }


  return (
      <div className='board_wrapper p-2'>
        <div className='board_header pb-3'>
          <div className='board_title text-4xl p-5'>커뮤니티</div>
          <div className="board_action flex justify-between">
            <div className="search px-2 py-1 rounded-sm bg-white shadow-lg flex items-center">
              
              <select name="" id="" className='rounded-sm py-1 pr-5' onChange={(e)=>{
                setKeyType(e.target.value);
              }}> 
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="nick_name">작성자</option>
              </select>
              <input type="text" 
                className='px-3 py-2 border-b' 
                value={keyword} 
                onChange={(e)=>setKeyword(e.target.value)}
                onKeyDown={(e)=>{
                  if(e.code == "Enter") handleSearch();
                }}
              />
              <div onClick={handleSearch} className='px-5 cursor-pointer select-none flex rounded-xl py-1 '>
                검색
              </div>
            </div>
            <div className="info_and_create flex">
              {
                (user&&user.user)&&(
                <Link to={`/community/${boardId?boardId:1}/create`}>
                  <div className='px-2 py-3 bg-white shadow-lg flex'>
                    <NotebookPen />
                    게시글 작성
                  </div>
                </Link>)
              }
            </div>
          </div>
        </div>
        <div className="board_body">
          <div className='flex flex-col gap-2'>
          {
            posts.map((post,idx)=>(
              <div key={post.postId} className='bg-white p-2 rounded-lg shadow-lg'>
                <div className="post-header flex justify-between">
                  <div className="post-user-name min-w-[5rem] text-sm">{post.nickName}</div>
                  <div className="info flex justify-end  text-sm">
                    <div className="create-date min-w-[5rem]">조회수 : {post.viewCnt}</div>
                  </div>
                </div>
                <div className="post-body flex gap-2">
                    <Link to={`/community/post/${post.postId}`} className='w-full h-full'>
                      <div className="post-title w-full pl-[6rem] text-green-700">
                        <span className='text-lg '>{post.title}</span>
                        &nbsp;
                        <span className='text-yellow-600'>[{post.commentCnt}]</span>
                      </div>
                    </Link>
                </div>
                <div className="post-footer flex justify-between">
                  <div className="create-date min-w-[8rem] text-sm">{post.createdTime.substr(0,10)}</div>
                  <div className="post-num min-w-[5rem] text-center text-gray-600 text-sm">No. {post.postId}</div>
                </div>
              </div>
            ))
          }
          </div>
        
        </div>
        <div className="board_footer w-full flex justify-center p-5">
          <div className="board_nav w-1/3 flex justify-between rounded-sm shadow-lg bg-white py-2 px-3">
            <button>pre</button>
            <div className='text-center flex gap-1'>
              <span>1</span>
              <span>1</span>
            </div>
            <button>next</button>
          </div>
        </div>
      </div>
  )
}

export default CommunityBoard
