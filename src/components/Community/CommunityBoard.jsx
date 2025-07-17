import React, { useEffect, useState } from 'react'
import { Link, redirect, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getFilteredBoards, getPermission, getPosts, searchPost, searchPost2, searchQuery } from '../../js/community/communityUtils';
import {ArrowLeftIcon, ArrowRightIcon, MenuIcon, NotebookPen, SearchIcon, SettingsIcon, XIcon} from 'lucide-react'
import { useAuth } from '../../js/login/AuthContext';

const CommunityBoard = () => {
  const {user, loading} = useAuth();
  const {boardId} = useParams();
  const [posts, setPosts] = useState([]);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [keyword, setKeyword] = useState("");
  const [keyType, setKeyType] = useState(searchParams.get("key_type")?searchParams.get("key_type"):"title");
  const [pageCount, setPageCount] = useState(1);
  const navigate = useNavigate();
  const [writePermission, setWritePermission] = useState(false);
  const [postLoading, setPostLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [readBoards, setReadBoards] = useState([]);
  const [currentBoardName, setCurrentBoardName] = useState("");

  const page = searchParams.get("page")?searchParams.get("page"):1;
  const page_nav = (Math.floor(page/10)*10);
  // console.log("writePermission",writePermission);

  const updateCurrentBoardName = ()=>{
    if(!readBoards)return;
    for(let i = 0; i < readBoards.length; i++){
      if(readBoards[i].categoryId == boardId){
         return setCurrentBoardName(readBoards[i].categoryName);
      }
    }
    setCurrentBoardName("전체")
  }

  useEffect(()=>{
    updateCurrentBoardName();
  },[readBoards])

  useEffect(()=>{
    // console.log(user)
    if(loading) return;
    // console.log(user, " ; ",user.user.role);
    const role = (user.isLoggedIn)?user.user.role:"OTHERS";
    const update = async()=>{
      const result = await getFilteredBoards(role,"read");
      setReadBoards(result.boards);
      // console.log(result);
    }
    update();
  },[loading])

  const getWriteable = async ()=>{
    if(user&&user.user){
      if(!boardId) return setWritePermission(true);
      const wrp= await getPermission({
        role:user.user.role,
        boardId:boardId,
        permission:"write"
      })
      setWritePermission(wrp.permission);
    }
  }

  const update = async(query)=>{
    setPostLoading(true);
    setPosts([]);
    window.scrollTo({ top: 0});
    getWriteable();
    const res = await searchPost2(
      {
        board_id:boardId,
        query,
        setPosts
      }
    );
    // console.log("res.data.pageCount",res.data.pageCount)
    setPageCount(res.success?res.data.pageCount:1);
    setPostLoading(false);
  };

  
  useEffect(()=>{
    window.scrollTo({ top: 0});
  },[])

  useEffect(()=>{
    getWriteable();
  },[user])
  useEffect(()=>{
    // console.log(location);
    update(location.search);
    const keyword = searchParams.get("keyword");
    setKeyword(keyword?keyword:"");
    updateCurrentBoardName();
  },[searchParams,navigate])

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
  const getPostCategory = (categoryId)=>{
    if(!readBoards) return "";
    const find = readBoards.find((item)=>item.categoryId===categoryId);
    return find?.categoryName;
  }

  const handleMenuOpen = ()=>{

  }
  return (
      <div className='board_wrapper p-2'>
        <div className={`sm:hidden `}>
            {`커뮤니티 > ${currentBoardName}`}
        </div>
        <div className='board_header pb-3'>
          
          <div className='mobile_action sm:hidden fixed bottom-[20px] right-[20px]  z-9999'>
            <div
              onClick={()=>setMenuOpen((prev)=>!prev)}
              className='w-12 h-12 bg-white rounded-lg flex justify-center items-center text-green-600 cursor-pointer border border-[#4444]'>
              {
                menuOpen?(<XIcon />):(<MenuIcon />)
              }
            </div>
          </div>
          
          {
            (
              <div className={`fixed sm:hidden bottom-0 shadow-2xl overflow-hidden w-[17rem] ${menuOpen?"right-0":"right-[-20rem]"} h-full bg-white z-999 transition-all duration-500 p-5`}>
                {
                  (user?.user?.role === "ADMIN")&&(
                    <div className='absolute top-5 right-4 cursor-pointer p-2 flex gap-1' onClick={()=>navigate('/community/admin')}>
                      <SettingsIcon />
                    </div>
                  )
                }
                <div className='text-xl pb-3 font-bold text-green-700'>커뮤니티</div>
                <div className='w-full h-[2px] bg-green-700'/>
                <div className='text-lg flex flex-col gap-2'>
                  <div
                      className={`cursor-pointer pl-2 py-2 ${(!boardId)?"bg-emerald-50":""}`}
                      onClick={()=>navigate(`/community/`)}>
                      전체
                    </div>
                  {readBoards?.map((item, idx)=>(
                    <div key={idx} 
                      className={`cursor-pointer pl-2 py-2 ${(boardId==item.categoryId)?"bg-emerald-50":""}`}
                      onClick={()=>navigate(`/community/${item.categoryId}`)}>
                      {item.categoryName}
                    </div>
                  ))}
                </div>
                <div className='w-full h-[2px] bg-green-700'/>
                
                <div className='flex pt-2 pb-5'>              
                  <select name="" id="" className='py-1' value={keyType} onChange={(e)=>{
                    setKeyType(e.target.value);
                  }}> 
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                    <option value="nick_name">작성자</option>
                  </select>                
                  <div className='flex border-b'>
                    <input type="text" 
                      className='px-3 py-2 w-[9rem]' 
                      placeholder='검색'
                      value={keyword} 
                      onChange={(e)=>setKeyword(e.target.value)}
                      onKeyDown={(e)=>{
                        if(e.code == "Enter") handleSearch();
                      }}
                    />
                    <div onClick={handleSearch} className='cursor-pointer select-none flex rounded-xl py-1 '>
                      <SearchIcon/>
                    </div>
                  </div>

                </div>
                {
                (user&&user.user&&writePermission)&&(
                <div className='w-full'>
                <Link to={`/community/${boardId?boardId:1}/create`}>
                  <div className="cursor-pointer w-full shadow-md rounded-lg flex m-auto justify-center items-center py-1 gap-2 px-2">
                    <NotebookPen className='h-[2rem] w-[2rem]'/>
                    게시글 작성
                  </div>
                </Link>
                </div>)
                }
              </div>
            )
          }
            
          <div className="board_action hidden sm:flex justify-between">
            <div className="search px-2 py-1 rounded-sm bg-white shadow-lg flex items-center">
              
              <select name="" id="" className='rounded-sm py-1 pr-5' value={keyType} onChange={(e)=>{
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
                (user&&user.user&&writePermission)&&(
                <Link to={`/community/${boardId?boardId:1}/create`}>
                  <div className='px-2 py-3 bg-white shadow-lg rounded-sm flex hover:bg-green-100 transition-all duration-300'>
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
                {postLoading?"게시글을 불러오는 중 입니다.":"게시글이 없습니다."}
              </div>
            )
          }
          {
            posts.map((post,idx)=>(
              <Link to={`/community/post/${post.postId}`} key={post.postId} >
              <div className='bg-white p-2 rounded-lg shadow-lg hover:bg-green-50 transition-all duration-200'>
                <div className="post-header flex justify-between">
                  <div className="post-user-name min-w-[5rem] text-sm">{post.nickName}</div>
                  <div className="info flex justify-end  text-sm">
                    <div className="create-date min-w-[5rem]">조회수 : {post.viewCnt}</div>
                  </div>
                </div>
                <div className="post-body flex gap-2">
                      <div className="relative flex post-title w-full px-[2rem] sm:px-[6rem] text-green-700">
                        {
                          (boardId === undefined)&&(
                            <div className='text-xs text-gray-600 absolute top-0 left-0 hidden sm:block'>
                              {getPostCategory(post.categoryId)}
                            </div>
                          )
                        }
                        <div className='overflow-hidden text-ellipsis text-nowrap'>
                          <span className='text-sm sm:text-lg'>{post.title}</span>
                          &nbsp;
                        </div>
                        {(post.commentCnt>0)&&(<span className='text-yellow-600'>[{post.commentCnt}]</span>)}
                      </div>
                </div>
                <div className="post-footer flex justify-between">
                  <div className="create-date min-w-[8rem] text-sm">{post.createdTime.substr(0,10)}</div>
                  <div className="post-num min-w-[5rem] text-center text-gray-600 text-sm">No. {post.postId}</div>
                </div>
              </div>
              </Link>
            ))
          }
          </div>
        
        </div>
        <div className="board_footer w-full flex justify-center py-5 sm:p-5">
          <div 
            className={`
              board_nav w-full sm:w-1/2 flex justify-between 
              items-center rounded-xl shadow-lg bg-white 
              py-2 px-3 ${(posts.length<1)?"hidden":""}`}>
            <div className='w-[3rem]'>
            {
              (page>1)&&(
                <button className='items-center' onClick={handlePageMove(-1)}><ArrowLeftIcon/></button>
              )
            }
            </div>
            <div className='text-center flex gap-1'>
              {
                [...Array(pageCount)].map((item,idx)=>{
                  const p = idx+1;
                  // console.log(idx, p)
                  if(p > page_nav+10 || p < page_nav+1) return;
                  return (
                    <div key={p} onClick={handlePageNav(p)} className={`${(p==page)?"font-bold underline":""} cursor-pointer`}>{idx+1}</div>
                  )
                })
              }
            </div>
            <div className='w-[3rem]'>
            {
              (page<pageCount)&&(
                <button  className='items-center' onClick={handlePageMove(1)}><ArrowRightIcon/></button>
              )
            }
            </div>
          </div>
        </div>
      </div>
  )
}

export default CommunityBoard
