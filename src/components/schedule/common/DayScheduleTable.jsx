import { format } from 'date-fns';
import React, { useEffect, useState } from 'react'
import RadioLabels from './RadioLabels';
import { useGetScheduleList, useUpdateScheduleStatus } from '../../../js/schedule/schedule';
import { useDispatch } from 'react-redux';
import { setScheduleList } from '../../../js/redux/slice/sliceSchedule';

const DayScheduleTable = ({data, labels, radioChangeCallback}) => {
    const isMobile = window.innerWidth < 768; // 모바일 화면인지 체크
    const [raidoCheck, setRadioCheck] = useState();

    const formarNowDate = format(new Date(), "yyyy-MM-dd");

    // 스케쥴 상태 변경 요청(백엔드)
    const updateScheduleStatus = useUpdateScheduleStatus(); // 스케쥴 상태 변경 훅
    const getScheduleList = useGetScheduleList(); // 스케쥴 조회 훅
    const dispath = useDispatch();

    useEffect(() => {
      if(!(data == undefined || data.length == 0)){
        setRadioCheck(data.map(item => (item.status)));
      }
    }, [data]); // radio 버튼 정보 최초 한번만 입력


    const radioUseStateHandleChange = async (event, idx) => {
      const value = event.target.value;
      // formData 처리
      const formData = new FormData(document.getElementById(`scheduleDetail-${idx}`));
      const result = await updateScheduleStatus(formData, async () => {

            radioChangeCallback();

          // 변경된 데이터 조회
        //   let params = {
        //       ...calendarTerm,
        //       callback : (data) => {
        //           dispath(setScheduleList(data)); // 스케쥴리스트 리덕스 스토어 값 변경
        //       }
        //   }
        //   if(!(labels == undefined || labels.length == 0)){
        //       const checkedStatus = labels.filter(label => label.checked).map(label => label.codeId).join();
        //       if(checkedStatus.length > 0){
        //         params.checkedStatus = checkedStatus;
        //       }
        //   }
        //   const result = await getScheduleList(params);




          setRadioCheck(raidoCheck.map((item, index) => {
              return (idx == index ? value : item)
          }));
      });
    }
    
    return (
        <div className='overflow-auto max-h-150'>
            <h2 className='text-2xl font-bold mb-3'>운동 스케쥴</h2>
            <table className='w-full'>
                <colgroup>
                    <col width="20%"/>
                    <col width="50%"/>
                    <col width="30%"/>
                </colgroup>
                <thead className='bg-green-100 font-bold sticky'>
                    <tr>
                        <td>시간</td>
                        <td>스케쥴</td>
                        <td>관리</td>
                    </tr>
                </thead>
                <tbody>
                {
                    data?.map((schedule, idx) => (
                        (
                            schedule.status != 'D' && 
                            <tr key={idx}>
                                <td>
                                    <div className={(isMobile ? '' : 'flex justify-center')}>
                                        <div>{format(schedule.start, 'HH:mm')}</div>
                                        <div>&nbsp;~&nbsp;</div>
                                        <div>{format(schedule.end, 'HH:mm')}</div>
                                    </div>
                                </td>
                                <td>
                                    <div className={(isMobile ? '' : 'flex')}>
                                        <div>{schedule.title} {schedule.excersizeCnt} {schedule.unit}</div>
                                        <div>( {schedule.cal * schedule.excersizeCnt} cal 소모 )</div>
                                    </div>
                                </td>
                                <td>
                                    <form 
                                        id={"scheduleDetail-"+idx} 
                                        className={`schedule-detail-form-wrapper w-full flex${(isMobile ? ' flex-col gap-2' : ' justify-between gap-2')}  p-2`}>
                                        <input type="hidden" name="scheduleId" value={schedule.scheduleId}/>
                                        { 
                                          raidoCheck ? (
                                              <RadioLabels
                                                  labels={labels}
                                                  labelName="status"
                                                  disabled={!(formarNowDate >= format(schedule.start, 'yyyy-MM-dd'))}
                                                  labelId={`day-schedule-table-form-${idx}`}
                                                  radioUseState={raidoCheck[idx] || ''} 
                                                  radioUseStateHandleChange={(event) => {radioUseStateHandleChange(event, idx)}}/>
                                          ) : (
                                              <></>
                                          )
                                        
                                        }
                                        
                                    </form>
                                </td>
                            </tr>
                        ) 
                    ))
                }
                {
                    (
                      data == undefined || data.length == 0 ? 
                        <tr><td colSpan={3}>등록된 스케쥴이 없습니다.</td></tr> : <></>
                    )

                }
                </tbody>                  
            </table>
        </div>
    )
}

export default DayScheduleTable
