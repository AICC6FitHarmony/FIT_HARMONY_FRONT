import React, { useEffect, useState } from 'react'
import ListSelector from '../cmmn/ListSelector';
import {useAlertModal, useModal} from '../cmmn/ModalContext';
import InputWithLabel from '../cmmn/InputWithLabel';
import { getPermissions, PERMISSION_ROLES, PERMISSION_TYPES, updateBoard, updatePermission } from '../../js/community/communityUtils';
import { ArrowLeftFromLineIcon, LogOutIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommunityAdmin = ({boards, updateBoards}) => {
  const openModal = useModal();
  const openAlert = useAlertModal();
  const [currentBoard, setCurrentBoard] = useState();
  const [selectPermissions, setSelectPermissions] = useState();
  const [selectIdx, setSelectIdx] = useState(-1);
  const [changed, setChanged] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  console.log(selectPermissions);
  
  const roleText = ["관리자", "트레이너", "일반회원", "비회원"];
  const permissionText = ["읽기", "쓰기", "답글", "댓글"];

  const handleBoardSelect = async ({item,idx})=>{
    if(item.categoryId === currentBoard?.categoryId) return;
    const selectUpdate = async ()=>{
      setLoading(true);
      const res = await getPermissions({boardId:item.categoryId});
      const new_permissions = {};
      PERMISSION_ROLES.forEach((p_role, idx)=>{
        new_permissions[p_role] = {};
        PERMISSION_TYPES.forEach((p_type)=>{
          new_permissions[p_role][p_type] = false;
        })
      })
      res.permissions.forEach((data,idx)=>{
        new_permissions[data.role][data.permission] = true;
      })
      setCurrentBoard(item);
      setChanged(false);
      setSelectPermissions(new_permissions);
      setLoading(false);
    }

    if(changed){
      openModal({
        title:"수정 확인",
        children:(
          <div>
            수정 사항을 저장하시겠습니까?<br/>취소시 변경 사항이 초기화 됩니다.
          </div>
        ),
        cancelEvent: selectUpdate,
        closeEvent:()=>{setSelectIdx(currentBoard?.categoryId)},
        isCancelClose:true,
        isOkClose:true,
        size:{width:"auto", height:"auto"}
      });
    }else{
      selectUpdate();
    }
    // console.log(res);
  }

  const getPermissionValue = (role, permissionType) =>{
    if(!selectPermissions) return false;
    return selectPermissions[role][permissionType];
  }
  const handlePermissionChange = (role, p_type)=>(e)=>{
    if(!selectPermissions) return false;
    const new_permissions = {
      ...selectPermissions
    };
    new_permissions[role][p_type] = e.target.checked;
    setChanged(true);
    setSelectPermissions(new_permissions);
  }
  const handleChange = async(e)=>{
    const new_BoardInfo = {
      ...currentBoard
    }
    console.log()
    if(e.target.type === "checkbox"){
      new_BoardInfo[e.target.name] = e.target.checked;
    }
    else{
      new_BoardInfo[e.target.name] = e.target.value;
    }
    setChanged(true);
    setCurrentBoard(new_BoardInfo);
  }

  const handleUpdate = async()=>{
    if(!changed) return;
    if(!currentBoard) return;

    const permissions = [];
    PERMISSION_ROLES.forEach((role)=>{
      PERMISSION_TYPES.forEach((permission)=>{
        if(selectPermissions[role][permission]) permissions.push({role, permission})
      })
    })
    
    setLoading(true);
    const b_res = await updateBoard(currentBoard);
    if(b_res.success===false) return;


    const req_body={
      boardId:b_res.board.categoryId,
      permissions:permissions
    }
    const p_res = await updatePermission(req_body);
    if(p_res.success){
      openAlert({title:"저장 완료", text:"저장이 완료되었습니다."})
      setChanged(false);
      updateBoards();
    }
    console.log("res",b_res);
    setLoading(false);
  }

  const handleAddBoard = ()=>{
    const newBoard = {
      categoryId : -1,
      categoryName : "New Board",
      isReply:false,
      isComment:false,
    }
    const new_permissions = {};
    PERMISSION_ROLES.forEach((p_role, idx)=>{
      new_permissions[p_role] = {};
      PERMISSION_TYPES.forEach((p_type)=>{
        new_permissions[p_role][p_type] = false;
      })
    });

    setCurrentBoard(newBoard);
    setSelectPermissions(new_permissions);
    setChanged(true);
    setSelectIdx(-1);
  }

  return (
    <div className='px-4 pt-[3rem] pb-10'>
      <div className='header'>
        <div className='text-2xl pb-4 flex items-center justify-between'>
          <div className='font-bold'>게시판 관리 페이지</div>
          <div>
            <LogOutIcon className='cursor-pointer' onClick={()=>{navigate("/community")}}/>
          </div>
        </div>
      </div>
      <div className='body p-5 select-none flex lg:justify-between lg:flex-row flex-col justify-center items-center rounded-lg bg-white overflow-hidden shadow-md'>
        <div className='min-w-[20rem] w-1/3 h-[25rem] p-3'>
          <div className="border h-full">
            <div className='h-[2rem] p-2 pl-3'>게시판 목록</div>
            <div className='h-[calc(100%-4rem)] p-2'>
              <ListSelector
                list={boards}
                className="border"
                indexFunc={(item)=>item.categoryId}
                indexState={[selectIdx,setSelectIdx]}
                onSelect={handleBoardSelect}
                Template={({item})=>(
                  <div className='pl-5 py-1'>
                    {item.categoryName}
                  </div>
                )}
              />
            </div>
            <div className='flex justify-between h-[2rem] px-2 pb-2 gap-2'>
              <div className='bg-white w-1/2 text-center cursor-pointer'>제거</div>
              <div className='bg-white w-1/2 text-center cursor-pointer' onClick={handleAddBoard}>추가</div>
            </div>
          </div>
        </div>
        <div className='setting-wrapper w-2/3 h-[25rem] p-3'>
          <div className='w-full h-full border relative'>
            <div className={'w-full h-full z-10 bg-[#0001] flex justify-center items-center absolute bottom-0 left-0 '+(loading?"":"hidden")}>
              <div className='text-3xl font-bold py-2 px-4 rounded-lg bg-white shadow-lg'>
                로딩중
              </div>
            </div>
            <div className='h-[2rem] p-2 pl-3'>게시판 수정</div>
            <div className="info h-[calc(100%-4rem)] p-2 flex justify-center gap-2 flex-col sm:flex-row">
              <div className='base w-1/2 min-w-[20rem] border'>
                <div className='p-2'>
                  <div>게시판 이름</div>
                  <InputWithLabel name="categoryName" value={currentBoard?.categoryName} onChange={handleChange}/>
                </div>
                <div className='p-2 flex bor gap-2 items-center'>
                  <div>댓글 사용 가능</div>
                  <input type="checkbox" name="isComment" checked={currentBoard?.isComment} onChange={handleChange}/>
                </div>
                <div className='p-2 flex bor gap-2 items-center'>
                  <div>답글 사용 가능</div>
                  <input type="checkbox" name="isReply" checked={currentBoard?.isReply} onChange={handleChange}/>
                </div>
              </div>
              <div className="permission w-1/2 border min-w-[20rem] p-2">
                {
                  PERMISSION_ROLES.map((role,idx)=>(
                    <div key={idx}>
                      <div className='text-sm'>{roleText[idx]}</div>
                      <div className='flex gap-3 justify-between px-3'>
                        {PERMISSION_TYPES.map((p_type, p_idx)=>(
                          <div key={p_idx} className='flex gap-1'>
                            <div>{permissionText[p_idx]}</div>
                            <input type="checkbox" checked={getPermissionValue(role,p_type)} onChange={handlePermissionChange(role,p_type)} id="" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="nav min-h-[2rem] flex items-center justify-end px-2">
              <div className="cursor-pointer" onClick={handleUpdate}>
                저장
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityAdmin
