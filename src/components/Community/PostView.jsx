import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { deletePost, getPost } from '../../js/community/communityUtils';
import { generateHTML } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import { FontSize } from './components/PostEditor';
import { useAuth } from '../../js/login/AuthContext';
import CommentsView from './components/CommentsView';
import ImageResize from 'tiptap-extension-resize-image';



const PostView = ({}) => {
  const {user} = useAuth();
  const [postHtml, setPostHtml] = useState();
  const [postInfo, setPostInfo] = useState({
    title:"", nickName:""
  });
  const {postId} = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      const data = await getPost(postId);
      const json = JSON.parse(data.content);
      const html = generateHTML(json,[
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      FontSize,
      Image,
      ImageResize,
      ]);
      setPostHtml(html);
      setPostInfo({
        title:data.title,
        nickName:data.nickName
      })
    };
    fetchPost();
  }, []);

  const handleDelete = async ()=>{
    const requestBody = {
      userId:user.user.userId,
      postId
    }
    const res = await deletePost(requestBody);
    console.log(res);
    if(res.success == false){
      alert(res.msg);
      return
    }
    location.href = "/community"
  }

  return (
    <div className='p-4.5'>
      <div className='post-wrapper flex flex-col gap-5 rounded-xl bg-white shadow-xl p-2'>

      <div className='post-header p-2'>
        <div className='post_title text-2xl border-[#ccc] text-green-700 font-bold'>
          {postInfo.title}
        </div>
        <div className='user-info font-light'>
          {postInfo.nickName}
        </div>
      </div>
      <div className='w-full h-[2px] bg-green-700'/>
      <div className='post_body rounded-sm min-h-[400px] p-2' dangerouslySetInnerHTML={{ __html: postHtml }}/>
      <div className='w-full h-[2px] bg-green-700'/>
      <div className='controls py-2 flex justify-end gap-3'>
        <Link to={`/community/${postId}/update`}>수정</Link>
        <button onClick={handleDelete}>삭제</button>
      </div>
      
      </div>
      <div className='pt-5'>
        <CommentsView/>
      </div>
    </div>
  )
}

export default PostView
