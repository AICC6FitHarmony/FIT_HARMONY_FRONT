// components/Editor.js
import React, { useState } from 'react';
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
import { postCreate } from '../../../js/community/comunityUtils';
const PostEditor = () => {
  const {boardId} = useParams();
  const [postTitle, setPostTitle] = useState('');
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

  const PostUpload = async()=>{
    const form = new FormData();
    
    const jsonContent = editor.getJSON();
    const cleanJSON = sanitizeContent(structuredClone(jsonContent));
    form.append('board_id',boardId);
    form.append('title',postTitle);
    form.append("content",JSON.stringify(cleanJSON));
    const result = await postCreate(form);
    console.log(result)
    if(result.success == false){

      return
    }
    location.href = `/community/post/${result.postId}`
  }

  const handleSave = async ()=>{
    if(!postTitle){
      return;
    }


    PostUpload();
  }

  return (
      <div className='p-4.5'>
      <div className='post-wrapper flex flex-col gap-5 rounded-xl bg-white shadow-xl p-2'>

      <div className='post-header p-2'>
        <div className='post_title border-[#ccc] text-green-700 font-bold'>
          <input
          type="text"
          placeholder="제목을 입력하세요"
          style={{
            width: '100%',
            fontSize: '1.5em',
            marginBottom: '1em',
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
