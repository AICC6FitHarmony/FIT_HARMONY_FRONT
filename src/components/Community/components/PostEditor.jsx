// components/Editor.js
import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document'
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Dropcursor from '@tiptap/extension-dropcursor';
import ImageResize from 'tiptap-extension-resize-image';
import "./PostEditor.css"
// 커스텀 FontSize 익스텐션
import { Mark, mergeAttributes } from '@tiptap/core';

const FontSize = Mark.create({
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
      Dropcursor,
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
    form.append('board_id',boardId);
    form.append('title',postTitle);
    form.append("content",JSON.stringify(jsonContent));
    const result = await postCreate(form);

  }

  const handleSave = async ()=>{
    if(!postTitle){
      return;
    }


    PostUpload();
  }

  return (
    <div>
      {/* 제목 입력 */}
      <input
        type="text"
        placeholder="제목을 입력하세요"
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '1.5em',
          marginBottom: '1em',
        }}
        onChange={(e)=>{setPostTitle(e.target.value)}}
      />

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
      <button onClick={handleSave}>저장</button>
    </div>
  );
}

export default PostEditor
