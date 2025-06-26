import React from 'react'
import { Link, useParams } from 'react-router-dom';

const CommunityBoard = () => {
  const {boardId} = useParams();
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
              <Link to={`/community/${boardId}/create`}>
              생성
              </Link>
            </div>
          </div>
        </div>
        <div className="board_body">
          
        </div>
        <div className="board_footer">
          <div className="boar_nav">

          </div>
        </div>
      </div>
  )
}

export default CommunityBoard
