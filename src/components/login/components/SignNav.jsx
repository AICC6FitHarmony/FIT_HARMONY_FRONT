import React from 'react'

const SignNav = ({tabIdx,setTabIdx,idxMax}) => {
  const handlePrev = ()=>{
    if(tabIdx>0)
      setTabIdx(tabIdx-1);
  }
  const handleNext = ()=>{
    if(tabIdx<idxMax)
      setTabIdx(tabIdx+1);
  }
  return (
    <div className="footer flex justify-between absolute w-full bottom-1 py-2 px-5">
      <div className={"prev-btn w-1/3 text-center"+` ${tabIdx===0?'opacity-0':''}`} onClick={handlePrev}>
        prev
      </div>
      <div className={"next-btn w-1/3 text-center"+` ${tabIdx===idxMax?'hidden':''}`} onClick={handleNext}>
        next
      </div>
    </div>
  )
}

export default SignNav
