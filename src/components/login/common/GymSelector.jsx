import React, { useState } from 'react'
import { AddressSelectorWithModal } from './AddressSelector';
import InputWithLabel from '../../cmmn/InputWithLabel';

const GymSelector = () => {
  const [newGym, setNewGym] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");

  const handleComplete = (data) => {
    setZipCode(data.zonecode);
    setAddress(data.address);
    setIsOpen(false);
  };

  const handleChange = (e)=>{

  }

  const selectClass = "bg-orange-200 p-1 shadow";
  const unSelectClass = "bg-orange-50 p-1 text-gray-400";


  return (
    <div>
      <div className="nav flex">
        <div className={"cursor-pointer rounded-l-sm " + (newGym?unSelectClass:selectClass)} onClick={()=>setNewGym(false)}>기존</div>
        <div className={"cursor-pointer rounded-r-sm "+ (newGym?selectClass:unSelectClass)} onClick={()=>setNewGym(true)}>신규</div>
      </div>

      <div className={`select-gym pt-[1rem] flex flex-col gap-2 ${newGym?"hidden":""}`}>
        <InputWithLabel
          label={"이름"}
        />
      </div>



      <div className={`new-gym pt-[1rem] flex flex-col gap-2 ${newGym?"":"hidden"}`}>
        <div className='flex justify-end'>
          <div onClick={()=>setIsOpen(true)} className='w-[6rem] cursor-pointer text-center rounded-sm border'>주소 검색</div>
        </div>
        <AddressSelectorWithModal isOpen={isOpen} setIsOpen={setIsOpen} setAddress={setAddress}/>
        <InputWithLabel
          label={"주소"}
          name={"address"}
          // onChange={handleChange}
          value={address}
          readOnly={true}
          placeholder={"주소 검색 버튼을 클릭해주세요."}
        />
        <InputWithLabel
          label={"상세"}
          name={"address_detail"}
          onChange={handleChange}
          placeholder={"상세 주소를 입력해 주세요."}
        />
        <InputWithLabel
          label={"이름"}
          name={"gym_name"}
          onChange={handleChange}
          placeholder={"소속 체육관(단체) 이름을 적어주세요."}
        />
      </div>
    </div>
  )
}

export default GymSelector
