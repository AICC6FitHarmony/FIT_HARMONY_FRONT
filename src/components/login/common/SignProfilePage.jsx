import React, { useRef, useState } from 'react'
import defaultProfileImg from '../source/defaultProfileImg.png';
import InputWithLabel from '../../cmmn/InputWithLabel';
import { existNickName } from '../../../js/login/loginUtils';

const SignProfilePage = ({userInfo, setUserInfo, handleChangeValue}) => {
  const [imgSource, setImgSource] = useState("");
  const [nickCheck, setNickCheck] = useState(false);
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

  const handleNameExist = async ()=>{
    const res = await existNickName(userInfo.nick_name);
    console.log(res)
    setNickCheck(true);
    handleChangeValue({target:{name:"nickExist", value:res.isExist}});
  }

  return (
  <div className={'flex justify-center flex-col items-center'}>
    <div className='profile_img rounded-full w-30 h-30 border overflow-hidden' onClick={handleProfileImage}>
      <img src={imgSource?imgSource:defaultProfileImg} alt="" />
    </div>
    <input name="profile_image" onChange={handleChangeImage} className='hidden' type="file" accept=".png, .jpeg, .jpg"  id="photo" ref={profile_img_ref}/>

    <div className='pt-5 gap-4 flex flex-col items-center'>
      <InputWithLabel 
        name={"nick_name"}
        className=""
        value={userInfo.nick_name} 
        onChange={handleChangeValue} 
        placeholder="프로필 네임"
        waringText="특수 문자는 입력할 수 없습니다." 
        isWaring={hasSpecial(userInfo.nick_name)}
        />
      <div className='relative w-full'>
        <div className={`w-full text-center cursor-pointer px-2 py-1 rounded-lg border border-gray-300 ${
            nickCheck
            ?
             userInfo.nickExist?"bg-red-300":"bg-green-100"
            :""
          }`}
          onClick={handleNameExist}
          >
          중복 확인
        </div>
        {
        nickCheck&&(
          <div className='absolute bottom-[-1.5rem] left-0 text-sm'>
            {
              userInfo.nickExist
              ?(<div className='text-red-600'>중복된 닉네임 입니다.</div>)
              :(<div className='text-green-700'>사용 가능한 닉네임 입니다.</div>)
            }
          </div>
          )
        }
      </div>
    </div>

  </div>
  )
}

export default SignProfilePage
