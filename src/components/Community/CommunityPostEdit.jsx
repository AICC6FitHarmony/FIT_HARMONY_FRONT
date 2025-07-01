import React from 'react'
import PostEditor from './components/PostEditor'
import { useParams } from 'react-router-dom';
import { postCreate } from '../../js/community/communityUtils';

const CommunityPostEdit = () => {
  const {boardId} = useParams();
  const handleCreate = async(form)=>{
    form.append("board_id", boardId);

    const result = await postCreate(form);
    console.log(result)
    if(result.success == false){
      return
    }
    location.href = `/community/post/${result.postId}`
  }

  return (
    <div className='min-h-[500px]'>
      <PostEditor handleSubmit={handleCreate}/>
    </div>
  )
}

export default CommunityPostEdit
