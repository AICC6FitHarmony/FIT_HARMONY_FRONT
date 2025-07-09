import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useImageFileUpload, useUpdateGroupId } from '../../../js/common/util';
import { useRequest } from '../../../js/config/requests';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Img from '../../common/Img';
import { useSelector } from 'react-redux';

const DietScheduleTable = ({data, selectDate, dietRegCallback}) => {
    const isMobile = useSelector(state => state.common.isMobile); // 모바일 화면인지 체크
    
    const [totalCal, setTotalCal] = useState();
    
    const [file, setFile] = useState(null); // 파일 세팅 useState
    const fileUpload = useImageFileUpload(); // fileupload hook
    const updateGroupId = useUpdateGroupId(); // groupId 수정

    const request = useRequest();

    const aiPictureCalcCal = (e) => {
        setFile(e.target.files[0])
    }


    const formarNowDate = format(new Date(), "yyyy-MM-dd");

    // 파일 등록 후 file 변경 감지 후 동작
    useEffect(() => {
        if(file){
            upload();
        }
    }, [file])

    const upload = async () => {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const upload = await fileUpload(uploadFormData);

        const option = {
            method:'POST',
            body : {
                fileId : upload.fileIdArr[0],
            }
        }
        
        const dietResult = await request('/schedule/requestAiDiet', option);

        if(dietResult.success){
            const updateGroupIdResult = await updateGroupId({groupId : upload.groupId, newGroupId: `diet-${dietResult.dietId}`});
            if(updateGroupIdResult.success){
                if(dietRegCallback){
                    dietRegCallback();
                }
            }else{
                toast.error("에러가 발생했습니다.\n잠시후 다시 이용해주세요.", {
                    position: "bottom-center"
                });
            }
        }else{
            toast.error("에러가 발생했습니다.\n잠시후 다시 이용해주세요.", {
                position: "bottom-center"
            });
        }
    }

    // 최초 진입 처리
    useEffect(() => {
        let totalCal = data?.reduce((sum, item) => sum + item.totalCalorie, 0);
        setTotalCal(totalCal)
    }, [])

    return (
      <div className='w-full h-full flex flex-col justify-start'>
          <h2 className='text-2xl font-bold mb-3'>식단(ToDay Total : {totalCal})</h2>
          <div className='h-full max-h-[450px] overflow-y-auto'>
            <table className='w-full bg-white'>
                <colgroup>
                    <col width="30%"/>
                    <col width="80%"/>
                </colgroup>
                <thead className='bg-green-100 font-bold sticky z-1 top-0'>
                    <tr>
                        <td colSpan={2}>식단</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        data?.map((item, idx) => (
                            (
                            item.status == 'D' ? 
                                <tr key={idx}>
                                    <td>
                                        <div className='flex flex-col items-center justify-center'>
                                            <Img src={`/common/file/${item.fileId}`} alt={``} className="w-30"/>
                                        </div>
                                    </td>
                                    <td className='text-left' style={{textAlign:'left'}}>
                                        <h2 className='text-xl font-bold'>{item.title}({item.totalCalorie} cal)</h2>
                                        <ul className={`list-disc pl-6 ${(isMobile ? '' : 'grid grid-cols-2')}`} style={{listStyle:'disc'}}>
                                        {
                                            item.menus?.split('|').map((item, idx) => (
                                                <li key={idx}>{item}</li>
                                            ))
                                        }
                                        </ul>
                                    </td>
                                </tr> : ''
                            )
                        ))
                    }
                    <tr className='sticky bottom-0'>
                        <td colSpan={2}>
                            <form id="dietFileUpload" className='w-full'>
                                <label className={`diet-file-upload w-full h-full flex justify-center cursor-pointer ${(formarNowDate != selectDate ? 'opacity-30' : '')}`} htmlFor='file'>
                                    <Plus/>식단 등록
                                    <input id="file" className='hidden' type="file" name="file" onChange={aiPictureCalcCal} disabled={formarNowDate != selectDate}/>
                                </label>
                            </form>
                        </td>
                    </tr>
                </tbody>
            </table>
          </div>
      </div>
    )
}

export default DietScheduleTable
