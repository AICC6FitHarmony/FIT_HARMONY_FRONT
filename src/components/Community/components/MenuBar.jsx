import React, { useRef, useState } from 'react'
import { ALargeSmallIcon, AlignCenterIcon, AlignLeftIcon, AlignRightIcon, BaselineIcon, BoldIcon, BrushIcon, ImagePlusIcon, ImageUpIcon, ItalicIcon, PaintBucketIcon } from 'lucide-react';
import { useImageFileUpload, useUpdateGroupId } from '../../../js/common/util';


const MenuBar = ({ editor }) => {
  const [fontSize, setFontSize] = useState('16px');
  const [fontColor, setFontColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const fileInputRef = useRef(null);

  const fileUpload = useImageFileUpload();
  const updateGroupId = useUpdateGroupId();

  if (!editor) {
    return null;
  }

  // URL로 삽입
const addImageFromUrl = () => {
  const url = window.prompt('이미지 URL을 입력하세요');
  if (url) {
    editor.chain().focus().setImage({ src: url, width: '300px' }).run();
  }
};

const uploadImage = async (file)=>{
  const uploadFormData = new FormData();
  uploadFormData.append('file', file);
  const upload = await fileUpload(uploadFormData);
  const updateGroupIdResult = await updateGroupId({groupId : upload.groupId, newGroupId: 'post-img-test'});
  return upload;
}

// 로컬 파일 삽입
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // 이미지 업로드 후 url 리턴
  const img_info = await uploadImage(file);
  if(img_info.fileIdArr.length === 0){
    console.log("ERROR");
    return
  }
  const img_url = `${import.meta.env.VITE_BACKEND_DOMAIN}/common/file/${img_info.fileIdArr[0]}`;
  console.log(img_info);

  editor.chain().focus().setImage({ src: img_url, width: '300px' }).run();

  return;
  // const reader = new FileReader();
  // reader.onload = () => {
  //   editor.chain().focus().setImage({ src: reader.result, width: '300px', style:{width:'300px'}}).run();
  // };
  // reader.readAsDataURL(file);
  // e.target.value = '';
};

  const handleFontSizeChange = (e) => {
    const size = e.target.value;
    setFontSize(size);
    editor.chain().focus().setFontSize(size).run();
  };


  const handleFontColorChange = (e) => {
    const color = e.target.value;
    setFontColor(color);
    editor.chain().focus().setColor(color).run();
  };
  const handleBgColorChange = (e) => {
    const color = e.target.value;
    setBgColor(color);
    editor.chain().focus().setTextAttributes({ backgroundColor: color }).run();
  };
  return (
    <div className='flex gap-5 items-center'>
      <div className="font-deco flex items-center">
        <button onClick={() => editor.chain().focus().toggleBold().run()}><BoldIcon/></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}><ItalicIcon/></button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}><BaselineIcon/></button>
      </div>

      {/* 글자 크기 */}
      <label className='flex items-center'>
        <ALargeSmallIcon/>
        <select value={fontSize} onChange={handleFontSizeChange}>
          <option value="12px">12px</option>
          <option value="16px">16px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="36px">36px</option>
        </select>
      </label>

      {/* 글자 색상 */}
      <label className='flex items-center gap-1'>
        <BrushIcon/>
        <input
          type="color"
          value={fontColor}
          onChange={handleFontColorChange}
          style={{ verticalAlign: 'middle', marginLeft: '0.25em' }}
        />
      </label>

      {/* 배경 색상 */}
      <label className='flex items-center gap-1'>
        <PaintBucketIcon/>
        <input
          type="color"
          value={bgColor}
          onChange={handleBgColorChange}
          style={{ verticalAlign: 'middle', marginLeft: '0.25em' }}
        />
      </label>

      {/* 정렬 */}
      <div className='flex items-center gap-1'>
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeftIcon/></button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenterIcon/></button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRightIcon/></button>
      </div>

      {/* 이미지 삽입 */}
      <div className='flex items-center gap-1'>
        <button onClick={addImageFromUrl} title='주소로 이미지 추가'><ImagePlusIcon/></button>
        <button onClick={() => fileInputRef.current.click()} title='이미지 파일 업로드'><ImageUpIcon/></button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
}


export default MenuBar
