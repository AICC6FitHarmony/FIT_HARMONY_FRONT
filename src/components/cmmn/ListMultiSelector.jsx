import React, { useEffect, useState } from 'react'

const ListMultiSelector = ({
  list, //array
  onSelect, //선택시 해당 {item, idx} return
  className, //내부 wrapper class name
  selectColor, //선택시 선택 아이템 bg
  bgColor, //아이템 bg
  Template //리스트아이템 템플릿 ({item})=>(<></>) 형태 입력
}) => {
  const [selectIdx, setSelectIdx] = useState([]);
  
  if(!selectColor) selectColor = "#f0fff4";
  if(!bgColor) bgColor = "#fff";

  const updateSelect = (idx)=>{
    const ns = [...selectIdx]
    ns[idx] = !ns[idx];
    setSelectIdx(ns);
    return ns;
  }

  useEffect(()=>{
    const ns = [];
    list.forEach(_ => {
      ns.push(false);
    });
    console.log(ns);
    setSelectIdx(ns);
  },[])

  const handleSelect = (idx, item)=>(e)=>{
    // selectIdx.add(idx);
    const ns = updateSelect(idx);
    onSelect&&onSelect({selects:ns, list});
    // console.log(selectIdx);
    // console.log(e.target.style["backgroundColor"] = (checkSelect(idx)===idx)?selectColor:bgColor)
  }
  

  const checkSelect = (index)=>{
    // console.log(selectIdx.has(index));
    if(selectIdx[index]) return true;
    return false;
  }

  return (

      <div className={`w-full h-full overflow-y-auto ${className}`}>
      {
        list?.map((item, idx)=>{
          return (
            <div 
              key={idx} 
              onClick={handleSelect(idx,item)} 
              className={`item-wrapper cursor-pointer`}
              style={{backgroundColor:(checkSelect(idx))?selectColor:bgColor}}
              >
              {
                Template
                ? (<Template item={item} selected={checkSelect(idx)}/>)
                : {item}
              }
            </div>
          )
        })
      }
      </div>

  )
}

export default ListMultiSelector
