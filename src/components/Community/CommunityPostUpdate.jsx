import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import PostEditor from './components/PostEditor';
import { getPost, postUpdate } from '../../js/community/communityUtils';

const CommunityPostUpdate = () => {
  const {postId} = useParams();
  const [postData, setPostData] = useState({
    title:"", content:undefined
  })

  useEffect(()=>{
    const init = async()=>{
      const data = await getPost(postId);
      // console.log(data);
      setPostData({
        title:data.title, content:JSON.parse(data.content)
      })
    }

    init();
  },[]);

  const handleUpdate = async(form)=>{
    form.append("post_id", postId);

    const result = await postUpdate(form);
    console.log(result)
    if(result.success == false){
      return
    }
    location.href = `/community/post/${postId}`
  }
  return (
    <div>
      <PostEditor handleSubmit={handleUpdate} defaultPost={postData}/>
    </div>
  )
}

export default CommunityPostUpdate
