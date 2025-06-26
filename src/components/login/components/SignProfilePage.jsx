import React, { useRef, useState } from 'react'
import defaultProfileImg from '../defaultProfileImg.png';

const SignProfilePage = ({userInfo, setUserInfo, handleChangeValue}) => {
  const [imgSource, setImgSource] = useState("");
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const profile_img_ref = useRef();
  const specialCharRegex = /[^가-힣a-zA-Z0-9]/;

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setHasSpecialChar(specialCharRegex.test(inputValue));
    handleChangeValue(e);
  };

  const handleProfileImage = ()=>{
    profile_img_ref.current.click();
  }

  const handleChangeImage = ()=>{
    // console.log(profile_img_ref.current.value);
    const file = profile_img_ref.current.files[0];
    const reader = new FileReader();
    // setFile(file);
    const newInfo = {
      ...userInfo,
    }
    newInfo["profile_image"] = file;
    setUserInfo(newInfo);
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImgSource(reader.result);
   	};
  }

  return (
  <div className={'flex justify-center flex-col items-center'}>
    <div className='profile_img rounded-full w-30 h-30 border overflow-hidden' onClick={handleProfileImage}>
      <img src={imgSource?imgSource:defaultProfileImg} alt="" />
    </div>
    <input name="profile_image" onChange={handleChangeImage} className='hidden' type="file" accept=".png, .jpeg, .jpg"  id="photo" ref={profile_img_ref}/>
    <input name='nick_name' className={'text-center border mt-5 py-2 ' + `${hasSpecialChar?'border-red-500':''}`} type="text" placeholder='프로필 네임' onChange={handleChange}/>
    {
      hasSpecialChar?(
        <p className='text-sm text-red-500'>특수문자는 입력할수 없습니다.</p>
      ):''
    }
  </div>
  )
}

export default SignProfilePage
