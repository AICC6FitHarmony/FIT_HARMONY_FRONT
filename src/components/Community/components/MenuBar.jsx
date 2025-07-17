import React, { useRef, useState } from 'react'
import { ALargeSmallIcon, AlignCenterIcon, AlignLeftIcon, AlignRightIcon, BaselineIcon, BoldIcon, BrushIcon, ImagePlusIcon, ImageUpIcon, ItalicIcon, PaintBucketIcon } from 'lucide-react';
import { useImageFileUpload, useUpdateGroupId } from '../../../js/common/util';
import { BiFontColor, BiFontSize } from "react-icons/bi";

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

  editor.chain().focus().setImage({ src: img_url, style:"width:300px"}).run();

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
    console.log(editor.chain().focus());
    editor.chain().focus().setBackgroundColor(color).run();
  };
  return (
    <div className='sm:flex gap-5 items-center pb-1'>
      <div className='flex gap-5'>
      <div className="font-deco flex items-center gap-1">
        <div className='cursor-pointer' onClick={() => editor.chain().focus().toggleBold().run()}><BoldIcon className='w-5'/></div>
        <div className='cursor-pointer' onClick={() => editor.chain().focus().toggleItalic().run()}><ItalicIcon className='w-5'/></div>
        <div className='cursor-pointer' onClick={() => editor.chain().focus().toggleUnderline().run()}><BaselineIcon className='w-5'/></div>
      </div>
      
      {/* 글자 크기 */}
      <label className='flex items-center'>
        <BiFontSize className='text-[1.3rem]'/>
        <select value={fontSize} className='cursor-pointer' onChange={handleFontSizeChange}>
          <option value="12px">12px</option>
          <option value="16px">16px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="36px">36px</option>
        </select>
      </label>

      {/* 글자 색상 */}
      <label className='flex items-center justify-center'>
        {/* <BrushIcon className='w-5'/> */}
        <BiFontColor className='text-[1.3rem]' />
        <input
          type="color"
          value={fontColor}
          onChange={handleFontColorChange}
          style={{ verticalAlign: 'middle'}}
          className='w-[1.5rem]'
          />
      </label>
      </div>
      {/* 배경 색상 */}
      {/* <label className='flex items-center gap-1'>
        <PaintBucketIcon/>
        <input
        type="color"
        value={bgColor}
        onChange={handleBgColorChange}
        style={{ verticalAlign: 'middle', marginLeft: '0.25em' }}
        />
        </label> */}

      <div className='flex gap-5'>
      {/* 정렬 */}
      <div className='flex items-center gap-1'>
        <div className='cursor-pointer' onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeftIcon/></div>
        <div className='cursor-pointer' onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenterIcon/></div>
        <div className='cursor-pointer' onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRightIcon/></div>
      </div>

      {/* 이미지 삽입 */}
      <div className='flex items-center gap-1'>
        <div className='cursor-pointer' onClick={addImageFromUrl} title='주소로 이미지 추가'><ImagePlusIcon className='w-5'/></div>
        <div className='cursor-pointer' onClick={() => fileInputRef.current.click()} title='이미지 파일 업로드'><ImageUpIcon className='w-5'/></div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        />
      </div>
    </div>
  );
}


export default MenuBar
