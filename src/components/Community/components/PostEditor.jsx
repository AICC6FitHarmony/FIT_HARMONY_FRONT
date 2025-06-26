import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import MenuBar from './MenuBar'
import Placeholder from '@tiptap/extension-placeholder'
import "./PostEditor.css";

const PostEditor = () => {

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '내용을 입력하세요...',
      }),
    ],
    content: ''
  })

  return (
    <div>
      <MenuBar editor={editor}/>
      <EditorContent editor={editor} className="min-h-[200px] border p-2 rounded-sm"/>
    </div>
  )
}

export default PostEditor
