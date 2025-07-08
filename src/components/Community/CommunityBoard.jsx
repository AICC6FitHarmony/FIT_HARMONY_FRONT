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
  const location = useLocation();
  const [keyword, setKeyword] = useState();
  const [keyType, setKeyType] = useState("title");
  const [pageCount, setPageCount] = useState(1);
  const navigate = useNavigate();

  const page = searchParams.get("page");
  const page_nav = (Math.floor(page/10)*10);


  const update = async(query)=>{
    const res = await searchPost(
      {
        board_id:boardId,
        query,
        setPosts
      }
    );
    console.log("res.data.pageCount",res.data.pageCount)
    setPageCount(res.success?res.data.pageCount:1);
  };
  useEffect(()=>{
    // console.log(location);
    update(location.search);
    const keyword = searchParams.get("keyword");
    setKeyword(keyword?keyword:"");
  },[searchParams])
  const handleSearch = async ()=>{
    const query = `${searchQuery(
      {
        board_id:boardId,
        page:1,
        key_type:keyType,
        keyword,
      }
    )}`
    const url = `/community/${query}`
    await navigate(url);
    // update(query);
  }
  const handlePageNav = (idx)=>async()=>{
    const query = `${searchQuery(
      {
        board_id:boardId,
        page:idx,
        key_type:searchParams.get("key_type"),
        keyword:searchParams.get("keyword"),
      }
    )}`
    console.log(query, idx);
    const url = `/community/${query}`
    await navigate(url);
    // update(query);
  }
  const handlePageMove = (amount) => {
    const p = Number(page) + amount;
    if(p<1) return handlePageNav(1);
    return handlePageNav(p);
  }

  return (
      <div className='board_wrapper p-2'>
        <div className='board_header pb-3'>
          
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
            posts.length===0&&(
              <div className='bg-white p-2 py-6 text-center rounded-lg shadow-lg'>
                게시글이 없습니다.
              </div>
            )
          }
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
          <div 
            className={`
              board_nav w-1/3 flex justify-between 
              items-center rounded-sm shadow-lg bg-white 
              py-2 px-3 ${(posts.length<1)?"hidden":""}`}>
            <div className='w-[3rem]'>
            {
              (page>1)&&(
                <button className='items-center' onClick={handlePageMove(-1)}>prev</button>
              )
            }
            </div>
            <div className='text-center flex gap-1'>
              {
                [...Array(pageCount)].map((item,idx)=>{
                  const p = idx+1;
                  console.log(idx, p)
                  if(p > page_nav+10 || p < page_nav+1) return;
                  return (
                    <div key={p} onClick={handlePageNav(p)} className={`${(p==page)?"font-bold":""} cursor-pointer`}>{idx+1}</div>
                  )
                })
              }
            </div>
            <div className='w-[3rem]'>
            {
              (page<pageCount)&&(
                <button  className='items-center' onClick={handlePageMove(1)}>next</button>
              )
            }
            </div>
          </div>
        </div>
      </div>
  )
}

export default CommunityBoard
