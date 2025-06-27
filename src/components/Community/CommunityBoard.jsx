import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { getPosts } from '../../js/community/comunityUtils';

const CommunityBoard = () => {
  const {boardId} = useParams();
  const [posts, setPosts] = useState([]);
  useEffect(()=>{
    getPosts(boardId, setPosts);
  },[]
)


  const totalCount = 0;

  return (
      <div className='board_wrapper border'>
        <div className='board_header border'>
          <div className='board_title'>커뮤니티</div>
          <div className="board_action flex justify-between">
            <div className="search border">
              <span>검색</span>
              <input type="text" />
              <select name="" id=""> 
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="user">작성자</option>
              </select>
            </div>
            <div className="info_and_create">
              <span>total : {totalCount}</span>
              <Link to={`/community/${boardId?boardId:1}/create`}>
              생성
              </Link>
            </div>
          </div>
        </div>
        <div className="board_body">
        <table className="min-w-full divide-y divide-green-200">
          <thead className="bg-green-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                번호
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                제목
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                작성자
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                작성일
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                조회수
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-green-100">
            {posts?.map((post) => {

              return(
                <tr key={post.postId} className="hover:bg-green-50">
                  <td className="px-4 py-2 text-sm text-gray-700">{post.postId}</td>
                  <td className="px-4 py-2 text-sm font-medium text-green-700 hover:underline cursor-pointer">
                    <Link to={`/community/post/${post.postId}`}>{post.title}</Link>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">{post.userId}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{post.createdTime}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{post.view_cnt}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
        <div className="board_footer">
          <div className="boar_nav">

          </div>
        </div>
      </div>
  )
}

export default CommunityBoard
