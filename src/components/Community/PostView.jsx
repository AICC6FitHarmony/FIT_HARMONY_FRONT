import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { deletePost, getPost } from '../../js/community/comunityUtils';
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
    <div className='p-7'>
      <div className='post-wrapper flex flex-col gap-5'>
      <div className='post-header flex'>
        <div className='post_title text-2xl border border-[#ccc] p-2'>
          {postInfo.title}
        </div>
        <div className='user-info'>
          {postInfo.nickName}
        </div>
      </div>
      <div className='post_body border border-[#ccc] rounded-sm min-h-[400px] p-2' dangerouslySetInnerHTML={{ __html: postHtml }}/>
      <div className='controls flex justify-end gap-3'>
        <button>수정</button>
        <button onClick={handleDelete}>삭제</button>
      </div>
      <CommentsView/>
      </div>
      
    </div>
  )
}

export default PostView
