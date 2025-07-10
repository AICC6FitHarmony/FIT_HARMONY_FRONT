// components/Editor.js
import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document'
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import ImageResize from 'tiptap-extension-resize-image';
import "./PostEditor.css"
// 커스텀 FontSize 익스텐션
import { Mark, mergeAttributes } from '@tiptap/core';

export const FontSize = Mark.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: element => element.style.fontSize,
        renderHTML: attributes => {
          if (!attributes.size) {
            return {};
          }
          return { style: `font-size: ${attributes.size}` };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        style: 'font-size',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setFontSize: size => ({ chain }) => {
        return chain().setMark(this.name, { size }).run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain().unsetMark(this.name).run();
      },
    };
  },
});

function sanitizeContent(node) {
  if (!node) return node;

  // attrs에 null 속성이 있으면 제거
  if (node.attrs) {
    Object.keys(node.attrs).forEach(key => {
      if (node.attrs[key] === null) {
        delete node.attrs[key];
      }
    });
  }

  // content 배열이 있으면 재귀적으로 처리
  if (Array.isArray(node.content)) {
    node.content = node.content.map(sanitizeContent);
  }
  return node;
}

import MenuBar from './MenuBar';
// import { ResizableImage } from './ResizableImage';
import Image from '@tiptap/extension-image';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../js/login/AuthContext';
import { getFilteredBoards } from '../../../js/community/communityUtils';
const PostEditor = ({handleSubmit, defaultPost}) => {
  const {user, loading} = useAuth();
  const [boards, setBoards] = useState([]);
  const {boardId:board_param} = useParams();
  const [postTitle, setPostTitle] = useState('');
  const [boardId, setBoardId] = useState(board_param?board_param:1);
  const editor = useEditor({
    extensions: [
      Document,
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      FontSize,
      Image,
      ImageResize
    ],
    content: '',
  });
  

  if (!editor) {
    return null;
  }

  useEffect(()=>{
    // console.log(user)
    if(loading||user?.loggedIn == false) return;

    const role = user.user.role;
    const update = async()=>{
      const result = await getFilteredBoards(role,"write");
      setBoards(result.boards);
      // console.log(result);
    }
    update();
  },[loading])

  useEffect(()=>{
    if(!defaultPost) return;
    setPostTitle(defaultPost.title)
    editor?.commands.setContent(defaultPost.content);
    setBoardId(defaultPost.boardId);
  },[defaultPost]);

  const generateForm = async()=>{
    const form = new FormData();
    const jsonContent = editor.getJSON();
    const cleanJSON = sanitizeContent(structuredClone(jsonContent));
    form.append("board_id", boardId);
    form.append('title',postTitle);
    form.append("content",JSON.stringify(cleanJSON));
    return form;
  }

  const handleSave = async ()=>{
    if(!postTitle){
      return;
    }
    const form = await generateForm();
    handleSubmit(form);
  }

  return (
      <div className='p-4.5'>
      <div className='post-wrapper flex flex-col gap-5 rounded-xl bg-white shadow-xl p-2'>

      <div className='post-header p-2 pb-0'>
        <div>
          <select name="" id="" value={boardId} onChange={(e)=>setBoardId(e.target.value)}>
            {
              boards?.map((item,idx)=>{
                return(
                <option key={idx} value={item.categoryId}>{item.categoryName}</option>
              )})
            }
          </select>
        </div>
        <div className='post_title border-[#ccc] text-green-700 font-bold'>
          <input
          type="text"
          placeholder="제목을 입력하세요"
          value={postTitle}
          style={{
            width: '100%',
            fontSize: '1.5em',
          }}
          onChange={(e)=>{setPostTitle(e.target.value)}}
        />
        </div>
        <div className='user-info font-light'>
          {/* {postInfo.nickName} */}
        </div>
      </div>
      <div className='w-full h-[2px] bg-green-700'/>

      

      <div className='post_body rounded-sm min-h-[400px] px-2'>
        {/* 메뉴바 */}
        <MenuBar editor={editor} />
        {/* 에디터 */}
        <EditorContent
          editor={editor}
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            minHeight: '300px',
          }}
        />
      </div>
      <div className='w-full h-[2px] bg-green-700'/>
      <div className='controls py-2 flex justify-end gap-3'>
        <button onClick={handleSave}>저장</button>
      </div>
      
      </div>
    </div>
  );
}

export default PostEditor
