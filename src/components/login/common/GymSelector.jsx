import React, { useEffect, useState } from 'react'
import { AddressSelectorWithModal } from './AddressSelector';
import InputWithLabel from '../../cmmn/InputWithLabel';
import { createGym, getGyms } from '../../../js/login/gymUtil';
import ListSelector from '../../cmmn/ListSelector';

const GymSelector = ({setSelect}) => {
  const [newGym, setNewGym] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [gymList, setGymList] = useState([]);
  const [gymFilter, setGymFilter] = useState("");
  const [gymInfo, setGymInfo] = useState({
    name:"",
    address:"",
    addressDetail:""
  });
  const [selectIdx,setSelectIdx] = useState(-1);

  const clearInfo = ()=>{
    setZipCode("");
    setAddress("");
    setGymInfo({
      name:"",
      address:"",
      addressDetail:""
    })
  }

  const handleComplete = (data) => {
    setZipCode(data.zonecode);
    setAddress(data.address);
    setIsOpen(false);
  };

  const updateGymList = async () =>{
    const res = await getGyms();
    setGymList(res.gyms);
    // console.log(gyms);
  }

  useEffect(()=>{
    
    updateGymList();
  },[]);

  const handleChange = (e)=>{
    const {name, value} = e.target;
    const newInfo = {
      ...gymInfo
    }
    newInfo[name] = value;
    setGymInfo(newInfo);
  }
  const handleSelect = ({idx, item})=>{
    // console.log(idx);
    setSelect&&setSelect(item);
  }

  const selectClass = "bg-orange-200 p-1 shadow";
  const unSelectClass = "bg-orange-50 p-1 text-gray-400";

  const handleAdd = async()=>{
    // 조건 체크
    if(!gymInfo.name.trim()){
      return;
    }
    if(!address.trim()){
      return;
    }
    if(!gymInfo.addressDetail.trim()){
      return;
    }

    const body = {
      gym_name : gymInfo.name.trim(),
      gym_address : `${address.trim()}, ${gymInfo.addressDetail.trim()}`
    }
    const res = await createGym(body);
    // console.log(res);
    await updateGymList();
    setSelect(res.gym);
    clearInfo();
    setNewGym(false);
    setGymFilter(res.gym.gym);
    setSelectIdx(res.gym.gymId);
  }
  const handleSearchGym = (e)=>{
    const value = e.target.value;
    setGymFilter(value);
  }
  const handleFilterGym = (item)=>{
    if(gymFilter==="") return true;
    // console.log(item.gym," : ", item.gym.includes(gymFilter))
    return item.gym.includes(gymFilter);
  }

  return (
    <div>
      <div className="nav flex">
        <div className={"cursor-pointer rounded-l-sm " + (newGym?unSelectClass:selectClass)} onClick={()=>setNewGym(false)}>기존</div>
        <div className={"cursor-pointer rounded-r-sm "+ (newGym?selectClass:unSelectClass)} onClick={()=>setNewGym(true)}>신규</div>
      </div>
      <div className={`select-gym pt-[1rem] flex flex-col gap-2 ${newGym?"hidden":""}`}>
        <div className='px-2'>
          <InputWithLabel label={"이름"} value={gymFilter} onChange={handleSearchGym}/>
        </div>
        <div className='h-[15rem] border border-neutral-300 rounded-sm shadow-md'>
          <ListSelector 
            list={gymList}
            indexState={[selectIdx, setSelectIdx]}
            indexFunc={(item)=>item.gymId}
            onSelect={handleSelect} 
            className=""
            filter={handleFilterGym}
            Template={
              ({item})=>(
                <div className='w-full px-2 py-2'>
                  <div className="title font-bold">
                    {item.gym}
                  </div>
                  <div className="address text-[.7rem]">
                    {item.gymAddress}
                  </div>
                </div>
              )
            }/>
        </div>
      </div>

      <div className={`new-gym pt-[1rem] flex flex-col gap-2 ${newGym?"":"hidden"}`}>
        <InputWithLabel
          label={"이름"}
          name={"name"}
          value={gymInfo.name}
          onChange={handleChange}
          placeholder={"소속 체육관(단체) 이름을 적어주세요."}
        />
        <AddressSelectorWithModal isOpen={isOpen} setIsOpen={setIsOpen} setAddress={setAddress}/>
        <div className='flex justify-end'>
          <div onClick={()=>setIsOpen(true)} className='w-[6rem] cursor-pointer text-center rounded-sm border'>주소 검색</div>
        </div>
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
          name={"addressDetail"}
          onChange={handleChange}
          value={gymInfo.addressDetail}
          placeholder={"상세 주소를 입력해 주세요."}
        />
        <div className='flex justify-end'>
          <div 
            onClick={handleAdd}
            className='w-fit h-fit py-1 px-10 rounded-sm border cursor-pointer'>
            추가
          </div>
        </div>
      </div>
    </div>
  )
}

export default GymSelector
