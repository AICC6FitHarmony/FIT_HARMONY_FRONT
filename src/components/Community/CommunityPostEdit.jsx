import React from 'react'
import PostEditor from './components/PostEditor'
import { useNavigate, useParams } from 'react-router-dom';
import { postCreate } from '../../js/community/communityUtils';
import { useModal } from '../cmmn/ModalContext';

const CommunityPostEdit = ({boards}) => {
  const navigate = useNavigate();
  const openModal = useModal();
  const handleCreate = async(form)=>{
    // form.append("board_id", boardId);

    const result = await postCreate(form);
    console.log(result)
    if(result.success == false){
      openModal(
        {
          title:"권한 없음",
          children:(
            <div className='text-center'>
              {result.msg}
            </div>
          )
        }
      )
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
