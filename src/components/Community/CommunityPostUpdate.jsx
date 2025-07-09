import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import PostEditor from './components/PostEditor';
import { getPost, postUpdate } from '../../js/community/communityUtils';
import { useAlertModal } from '../cmmn/ModalContext';

const CommunityPostUpdate = ({boards}) => {
  const {postId} = useParams();
  const openAlert = useAlertModal();
  const [postData, setPostData] = useState({
    title:"", content:undefined
  })

  useEffect(()=>{
    const init = async()=>{
      const res = await getPost(postId);
      const data = res.data;
      // console.log(data);
      setPostData({
        title:data.title, content:JSON.parse(data.content), boardId:data.categoryId
      })
    }

    init();
  },[]);

  const handleUpdate = async(form)=>{
    form.append("post_id", postId);

    const result = await postUpdate(form);
    console.log(result)
    if(result.success == false){
      openAlert({
        title:"권한 없음",
        children:(
          <div className='text-center'>
            {result.msg}
          </div>
        ),
        size:{width:"20rem",height:"auto"},
        isOkClose:true
      })
      return
    }
    location.href = `/community/post/${postId}`
  }
  return (
    <div>
      <PostEditor handleSubmit={handleUpdate} defaultPost={postData} boards={boards}/>
    </div>
  )
}

export default CommunityPostUpdate
