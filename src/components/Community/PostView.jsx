import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  deletePost,
  getBoardInfo,
  getPost,
} from '../../js/community/communityUtils';
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
import { useModal } from '../cmmn/ModalContext';

const PostView = ({}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [boardInfo, setBoardInfo] = useState({});
  const [postHtml, setPostHtml] = useState();
  const [postInfo, setPostInfo] = useState({
    title: '',
    nickName: '',
    userId: '',
  });
  const openModal = useModal();
  const { postId } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await getPost(postId);
      if (res.success == false) {
        navigate('/community');
        return;
      }
      const data = res.data;
      const json = JSON.parse(data.content);
      const html = generateHTML(json, [
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
        title: data.title,
        nickName: data.nickName,
        userId: data.userId,
      });

      const boardRes = await getBoardInfo(data.categoryId);
      setBoardInfo(boardRes.data.info);
    };
    fetchPost();
  }, []);

  const handleOpenDelete = () => {
    openModal({
      title: '삭제 확인',
      children: '게시글을 삭제하시겠습니까?',
      okEvent: handleDelete,
      isCancelClose: true,
      size: { width: 'auto', height: 'auto' },
    });
  };

  const handleDelete = async () => {
    const requestBody = {
      userId: user.user.userId,
      postId,
    };
    const res = await deletePost(requestBody);
    console.log(res);
    if (res.success == false) {
      alert(res.msg);
      return;
    }
    location.href = '/community';
  };

  return (
    <div className="p-4.5">
      <div className="post-wrapper flex flex-col gap-5 rounded-xl bg-white shadow-xl p-2">
        <div className="post-header p-2">
          <div className="post_title text-2xl border-[#ccc] text-green-700 font-bold">
            {postInfo.title}
          </div>
          <div className="user-info font-light">{postInfo.nickName}</div>
        </div>
        <div className="w-full h-[2px] bg-green-700" />
        <div
          className="post_body rounded-sm min-h-[400px] p-2"
          dangerouslySetInnerHTML={{ __html: postHtml }}
        />
        <div className="w-full h-[2px] bg-green-700" />
        <div className="controls py-2 flex justify-end gap-3">
          {user && user.user && user.user.userId == postInfo.userId && (
            <div className="font-bold flex gap-2">
              <Link to={`/community/${postId}/update`}>수정</Link>
              <div className="cursor-pointer" onClick={handleOpenDelete}>
                삭제
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="pt-5">
        {boardInfo.isComment ? <CommentsView /> : ''}
      </div>
    </div>
  );
};

export default PostView;
