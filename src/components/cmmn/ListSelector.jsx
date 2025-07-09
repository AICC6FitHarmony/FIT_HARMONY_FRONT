import React, { useState } from 'react'

const ListSelector = ({
  list, //array
  onSelect, //선택시 해당 {item, idx} return
  className, //내부 wrapper class name
  selectColor, //선택시 선택 아이템 bg
  bgColor, //아이템 bg
  Template, //리스트아이템 템플릿 ({item})=>(<></>) 형태 입력
  filter,//리스트 필터 함수 (item)=>{return bool}
}) => {
  const [selectIdx, setSelectIdx] = useState(-1);
  
  if(!selectColor) selectColor = "#f0fff4";
  if(!bgColor) bgColor = "#fff";

  const handleSelect = (idx, item)=>()=>{
    onSelect&&onSelect({idx, item});
    setSelectIdx(idx);
  }

  return (

      <div className={`w-full h-full overflow-y-auto ${className}`}>
      {
        list?.map((item, idx)=>{
          if(filter&&!filter(item)){
            console.log("object")
            return;
          }
          return (
            <div 
              key={idx} 
              onClick={handleSelect(idx,item)} 
              className={`cursor-pointer`}
              style={{backgroundColor:(selectIdx===idx)?selectColor:bgColor}}
              >
              {
                Template
                ? (<Template item={item}/>)
                : {item}
              }
            </div>
          )
        })
      }
      </div>

  )
}

export default ListSelector
