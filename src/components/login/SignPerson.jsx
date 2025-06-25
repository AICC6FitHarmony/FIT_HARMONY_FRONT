"use client"
import React, { useEffect, useRef, useState } from 'react'
import SignInputTab from './components/SignInputTab';
import defaultProfileImg from './defaultProfileImg.png';
import googleLogo from './googleIcon.png'
import { ToastContainer, toast } from 'react-toastify';


const SignPerson = () => {
  const [tabIdx, setTabIdx] = useState(0);
  const [file, setFile] = useState();
  const [userInfo, setUserInfo] = useState({
    nick_name: undefined,
    age: undefined,
    height: undefined,
    weight: undefined,
    gender: "M"
  });

  const idxMax = 3;

  const [imgSource, setImgSource] = useState("");
  const profile_img_ref = useRef();
  const imgRef = useRef();


  const handleSign = async () => {
    // const formData = { nickname:"TestNick" };
    const formData = new FormData();
    formData.append("nick_name",userInfo.nick_name);
    formData.append("age",userInfo.age);
    formData.append("gender",userInfo.gender);
    formData.append("height",userInfo.height);
    formData.append("weight",userInfo.weight);
    formData.append("profile_image",file);
      // 1. 세션에 form 저장
    const response = await fetch('http://localhost:8000/auth/google/register', {
      method: 'POST',
      credentials: 'include',
      // headers: { 'Content-Type': 'multipart/form-data'},
      // body: JSON.stringify(formData)
      body: formData
    });
    // 2. 직접 리디렉션 (백엔드가 바로 구글로 리디렉션하지 않고 URL만 응답하는 구조)
    const { redirectUrl } = await response.json(); // 예: { redirectUrl: "https://accounts.google.com/..." }
    location.href = redirectUrl;
  };
  const handleProfileImage = ()=>{
    profile_img_ref.current.click();
  }

  const handleChangeImage = ()=>{
    // console.log(profile_img_ref.current.value);
    const file = profile_img_ref.current.files[0];
    const reader = new FileReader();
    setFile(file);
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImgSource(reader.result);
   	};
  }

  const handlePrev = ()=>{
    if(tabIdx>0)
      setTabIdx(tabIdx-1);
  }
  const handleNext = ()=>{
    if(tabIdx<idxMax)
      setTabIdx(tabIdx+1);
  }

  const handleChangeValue = (e)=>{
    const {name, value} = e.target;
    const newInfo = {
      ...userInfo
    }
    newInfo[name] = value
    setUserInfo(newInfo);
  }

  const handleInputNumber = (e)=>{
    let {name, value} = e.target;
    value = value.replace(/[^0-9]/g, '');
    const newInfo = {
      ...userInfo
    }
    newInfo[name] = value
    setUserInfo(newInfo);
  }

  // console.log(userInfo)

  const valueCheck= async (rejectCheck,err,errAction)=>{
    if(rejectCheck){
      if(errAction) errAction();
      await toast.error(err, {
        position: "bottom-center"
      });
      return true;
    }
    return false;
  }
  
  const MoveIndex = (idx)=>()=>setTabIdx(idx);

  const handleSubmit = async ()=>{
    console.log(userInfo)
    if(await valueCheck(!userInfo.nick_name, "프로필 이름을 입력해 주세요",MoveIndex(0))) return;
    if(await valueCheck(userInfo.nick_name.length > 10, "프로필 이름이 너무 깁니다.",MoveIndex(0))) return;
    if(await valueCheck(!userInfo.age, "나이를 입력해 주세요",MoveIndex(1))) return;
    if(await valueCheck(!userInfo.height, "키를 입력해 주세요",MoveIndex(1))) return;
    if(await valueCheck(!userInfo.weight, "몸무게를 입력해 주세요",MoveIndex(1))) return;
    handleSign();
  }



  return (
    <div className='sign-box shadow-xl relative w-1/3'>
      <form action="">
        <div className={'flex justify-center flex-col items-center'+` ${tabIdx===0?'':'hidden'}`}>
          <div className='profile_img rounded-full w-30 h-30 border overflow-hidden' onClick={handleProfileImage}>
            <img src={imgSource?imgSource:defaultProfileImg} alt="" />
          </div>
          <input name="profile_image" onChange={handleChangeImage} className='hidden' type="file" accept=".png, .jpeg, .jpg"  id="photo" ref={profile_img_ref}/>
          <input name='nick_name' className='text-center border mt-5 py-2' type="text" placeholder='프로필 네임' onChange={handleChangeValue}/>
        </div>
        <div className={'flex justify-center flex-col items-center gap-1'+` ${tabIdx===1?'':'hidden'}`}>
          <div className="age w-full flex gap-2 items-center justify-between">
            <div>나이</div>
            <input name='age' onChange={handleInputNumber} className='text-center border py-2 w-[80%]' value={userInfo.age} type="text"/>
          </div>
          <div className="height w-full flex gap-2 items-center justify-between">
            <div>키</div>
            <input name='height' onChange={handleInputNumber} className='text-center border py-2 w-[80%]' value={userInfo.height} type="text"/>
          </div>
          <div className="weight w-full flex gap-2 items-center justify-between">
            <div>몸무게</div>
            <input name='weight' onChange={handleInputNumber} className='text-center border py-2 w-[80%]' value={userInfo.weight} type="text"/>
          </div>
          <div className='gender flex'>
            <div>
              <span>남</span>
              <input type="radio" onChange={handleChangeValue} defaultChecked={true} value='M' name='gender'/>
            </div>
            <div>
              <span>여</span>
              <input type="radio" onSelect={handleChangeValue} onChange={handleChangeValue} value='F' name='gender'/>
            </div>
          </div>
        </div>

        <div className={` ${tabIdx===2?'':'hidden'}`}>
          <h2>운동 수준이 어떻게 되시나요?</h2>
          <div>입문</div>
          <div>초급</div>
          <div>중급</div>
          <div>고급</div>
          <div>전문가</div>
        </div>

        <div className={` ${tabIdx===3?'':'hidden'}`}>
          <h2>운동 목표를 알려주세요?</h2>
          <div>체중 감소</div>
          <div>체중 유지</div>
          <div>체중 증가</div>
          <div>근육 증가</div>
        </div>
        <div className={`flex justify-center ${tabIdx===idxMax?'':'hidden'}`}>
          <div onClick={handleSubmit} className='text-lg py-2 w-2/3 rounded-sm bg-[#4285F4] text-neutral-100 text-center flex items-center px-2 gap-4'>
              <div className='w-10 h-10 p-1 bg-white rounded-sm'>
                <img src={googleLogo} alt="" />
              </div>
              <div className='w-auto text-center'>
                Google 계정으로 회원 가입
              </div>
          </div>
        </div>
        <div className="footer flex justify-between absolute w-full bottom-1 py-2 px-5">
          <div className={"prev-btn w-1/3 text-center"+` ${tabIdx===0?'opacity-0':''}`} onClick={handlePrev}>
            prev
          </div>
          <div className={"next-btn w-1/3 text-center"+` ${tabIdx===idxMax?'hidden':''}`} onClick={handleNext}>
            next
          </div>
        </div> 
      </form>
      {/* <button onClick={handleSign}>Sign</button> */}
      <ToastContainer/>
    </div>
  )
}

export default SignPerson
