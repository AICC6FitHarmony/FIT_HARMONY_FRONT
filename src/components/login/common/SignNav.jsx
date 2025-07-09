import React from 'react'
import {ArrowLeft, ArrowRight} from 'lucide-react'

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
    <div className="footer flex justify-between items-center absolute w-full h-[3rem] bottom-1 py-2 px-5">
      {
        tabIdx===0
        ?(<div></div>)
        :(
          <div className={"prev-btn hover:bg-green-50 w-1/2 h-full select-none cursor-pointer flex justify-center items-center"} onClick={handlePrev}>
            <ArrowLeft/>
          </div>
        )
      }
      {
      tabIdx===idxMax
      ?(<div></div>)
      :(
        <div className={"next-btn hover:bg-green-50 w-1/2 h-full select-none cursor-pointer flex justify-center items-center"} onClick={handleNext}>
          <ArrowRight />
        </div>
      )
      }   
    </div>
  )
}

export default SignNav
