import React from 'react'
import { AuthProvider, useAuthRedirect } from '../../js/login/AuthContext'
import StandardModal from '../cmmn/StandardModal';

const Community = () => {

  const totalCount = 0;

  // const { user, loading } = useAuthRedirect();
  // console.log("User : ",user);
  // console.log(loading);
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
              <button>생성</button>
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

export default Community
