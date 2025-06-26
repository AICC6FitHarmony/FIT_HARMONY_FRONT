import React from 'react'

const MenuBar = ({ editor }) => {
  if (!editor) return null

  return (
    <div style={{ marginBottom: '10px' }}>
      <button onClick={() => editor.chain().focus().toggleBold().run()}>
        Bold
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()}>
        Italic
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        H1
      </button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        Bullet List
      </button>
    </div>
  )
}


export default MenuBar
