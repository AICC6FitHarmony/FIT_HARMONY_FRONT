import React from 'react'
import PostEditor from './components/PostEditor'
import { useNavigate, useParams } from 'react-router-dom';
import { postCreate } from '../../js/community/communityUtils';

const CommunityPostEdit = ({boards}) => {
  const navigate = useNavigate();

  const handleCreate = async(form)=>{
    // form.append("board_id", boardId);

    const result = await postCreate(form);
    console.log(result)
    if(result.success == false){
      return
    }
    navigate(`/community/post/${result.postId}`)
  }

  return (
    <div className='min-h-[500px]'>
      <PostEditor handleSubmit={handleCreate} boards={boards}/>
    </div>
  )
}

export default CommunityPostEdit
