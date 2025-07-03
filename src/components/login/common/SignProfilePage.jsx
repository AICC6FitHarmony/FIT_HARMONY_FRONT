import React, { useRef, useState } from 'react'
import defaultProfileImg from '../defaultProfileImg.png';
import InputWithLabel from '../../cmmn/InputWithLabel';

const SignProfilePage = ({userInfo, setUserInfo, handleChangeValue}) => {
  const [imgSource, setImgSource] = useState("");
  const profile_img_ref = useRef();
  const specialCharRegex = /[^가-힣a-zA-Z0-9]/;


  const hasSpecial = (str) => specialCharRegex.test(str);

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

    <InputWithLabel 
      name={"nick_name"}
      className="pt-5"
      value={userInfo.nick_name} 
      onChange={handleChangeValue} 
      placeholder="프로필 네임"
      waringText="특수 문자는 입력할 수 없습니다." 
      isWaring={hasSpecial(userInfo.nick_name)}
      />

  </div>
  )
}

export default SignProfilePage
