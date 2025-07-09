import React, { useEffect, useState } from 'react'

const ListSelector = ({
  list, //array
  onSelect, //선택시 해당 {item, idx} return
  className, //내부 wrapper class name
  selectColor, //선택시 선택 아이템 bg
  bgColor, //아이템 bg
  Template, //리스트아이템 템플릿 ({item})=>(<></>) 형태 입력
  filter,//리스트 필터 함수 (item)=>{return bool}
  indexState, // [index, setIndex]
  indexFunc, // 아이템의 key값 체크 함수 (item)=>return index
}) => {
  const [selectIdx, setSelectIdx] = useState(-1);
  const [index, setIndex] = indexState?indexState:[undefined,undefined];

  if(!selectColor) selectColor = "#f0fff4";
  if(!bgColor) bgColor = "#fff";
  const handleSelect = (idx, item)=>()=>{
    onSelect&&onSelect({idx, item});
    indexState?setIndex(idx):setSelectIdx(idx);
    // console.log(idx," : index=>",index,"::",indexState);
  }

  return (

      <div className={`w-full h-full overflow-y-auto ${className}`}>
      {
        list?.map((item, idx)=>{
          const keyIndex = indexFunc?indexFunc(item):idx;
          if(filter&&!filter(item)){
            // console.log("object")
            return;
          }
          return (
            <div 
              key={keyIndex} 
              onClick={handleSelect(keyIndex,item)} 
              className={`cursor-pointer`}
              style={{backgroundColor:(keyIndex===(indexState?index:selectIdx))?selectColor:bgColor}}
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
