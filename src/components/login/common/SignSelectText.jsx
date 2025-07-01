import React, { useState } from 'react'

const SignSelectText = ({texts,title,infoHeader, userInfo, setUserInfo, handleChangeValue, handleInputNumber}) => {
  const [select, setSelect] = useState("");
  const handleSelect = (value)=>()=>{
    setSelect(value);
    const newInfo = {
      ...userInfo
    }
    newInfo[infoHeader] = value;
    setUserInfo(newInfo);
  }
  return (
    <div className=''>
      <div className='text-2xl text-center'>
        {title}
      </div>
      <div className='pt-10'>
        {
          texts.map((txt, idx)=>(
            <div 
            key={idx} 
            onClick={handleSelect(txt)}
            className={`text-center text-xl box-border px-2 py-2 cursor-pointer select-none relative ${txt===select?"bg-green-50 text-green-700":""}`}>
              {txt}
            {txt===select?(
              <div className='border-b border-green-700 absolute bottom-0 w-full left-0'/>
            ):''}
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default SignSelectText
