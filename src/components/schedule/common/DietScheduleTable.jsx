import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useImageFileUpload, useUpdateGroupId } from '../../../js/common/util';
import { useRequest } from '../../../js/config/requests';

const DietScheduleTable = ({data}) => {

    const [totalCal, setTotalCal] = useState();
    
    const [file, setFile] = useState(null); // 파일 세팅 useState
    const fileUpload = useImageFileUpload(); // fileupload hook
    const updateGroupId = useUpdateGroupId(); // groupId 수정

    const request = useRequest();

    const aiPictureCalcCal = (e) => {
        setFile(e.target.files[0])
    }


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
                fileId : upload.fileIdArr[0]
            }
        }
        
        const dietResult = await request('/schedule/requestAiDiet', option);
        const updateGroupIdResult = await updateGroupId({groupId : upload.groupId, newGroupId: `diet-${dietResult.dietId}`});

    }


    // 최초 진입 처리
    useEffect(() => {
        let totalCal = 0;
        data.forEach(item => {
          totalCal += Number(item.totalCalorie)
        });
        setTotalCal(totalCal)
    }, [])

    return (
      <div className='overflow-auto w-full max-h-80'>
          <h2 className='text-2xl font-bold mb-3'>식단(ToDay Total : {totalCal})</h2>
          <table className='w-full'>
              <colgroup>
                  <col width="30%"/>
                  <col width="70%"/>
              </colgroup>
              <thead className='bg-green-100 font-bold sticky'>
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
                                  <td></td>
                                  <td></td>
                              </tr> : ''
                        )
                    ))
                  }
                  <tr>
                    <td colSpan={2}>
                        <form id="dietFileUpload" className='w-full'>
                            <label className='diet-file-upload w-full h-full flex justify-center cursor-pointer' htmlFor='file'>
                                <Plus/>식단 등록
                                <input id="file" className='hidden' type="file" name="file" onChange={aiPictureCalcCal}/>
                            </label>
                        </form>
                    </td>
                  </tr>
              </tbody>
          </table>
      </div>
    )
}

export default DietScheduleTable
